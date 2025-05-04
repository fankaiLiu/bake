// server.js
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 默认配置
const DEFAULT_CONFIG = {
  sqlPaths: [],
  outputPath: ""
};

// 确保配置文件存在
function ensureConfigExists() {
  try {
    if (!Bun.file("bake_config.json").size) {
      Bun.write("bake_config.json", JSON.stringify(DEFAULT_CONFIG, null, 2));
    }
  } catch (error) {
    Bun.write("bake_config.json", JSON.stringify(DEFAULT_CONFIG, null, 2));
  }
}

// 用于记录请求的中间件函数
function logRequest(url, method) {
  console.log(`接收到请求: ${method} ${url}`);
}

// 使用AppleScript选择文件或目录 (macOS)
async function selectPathMacOS(type) {
  return new Promise((resolve, reject) => {
    let script;
    if (type === 'directory') {
      script = 'choose folder with prompt "请选择一个目录"';
    } else {
      script = 'choose file with prompt "请选择一个SQL文件" of type {"sql"}';
    }
    
    const osascript = spawn('osascript', ['-e', script]);
    let stdout = '';
    let stderr = '';
    
    osascript.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    osascript.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    osascript.on('close', (code) => {
      if (code === 0) {
        // AppleScript 返回的是类似 "alias Macintosh HD:Users:username:path:to:file"
        // 需要转换成标准路径
        const path = stdout.trim()
          .replace(/^alias /i, '')
          .replace(/:/g, '/')
          .replace(/^Macintosh HD/, '');
        resolve(`/${path}`);
      } else {
        // 用户可能取消了选择
        reject(new Error(stderr || '用户取消了选择'));
      }
    });
  });
}

// 跨平台选择路径
async function selectPath(type) {
  // 检测操作系统
  const platform = process.platform;
  
  try {
    if (platform === 'darwin') {
      // macOS
      return await selectPathMacOS(type);
    } else if (platform === 'win32') {
      // Windows - 这里需要实现Windows的路径选择
      throw new Error('Windows系统的路径选择功能尚未实现');
    } else {
      // Linux 等其他系统
      throw new Error('当前系统的路径选择功能尚未实现');
    }
  } catch (error) {
    console.error(`选择路径错误: ${error.message}`);
    throw error;
  }
}

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    logRequest(url.pathname, req.method);
    
    // 提供静态HTML
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(Bun.file("index.html"));
    }
    
    if (url.pathname === "/config.html") {
      return new Response(Bun.file("config.html"));
    }
    
    // 处理其他静态文件
    if (url.pathname.endsWith('.html') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
      try {
        const filePath = url.pathname.slice(1); // 移除前导斜杠
        return new Response(Bun.file(filePath));
      } catch (error) {
        return new Response("File not found", { status: 404 });
      }
    }
    
    // API健康检查
    if (url.pathname === "/api/health-check") {
      return Response.json({ status: "ok", timestamp: new Date().toISOString() });
    }
    
    // 文件读取 API
    if (url.pathname === "/api/read") {
      const content = await Bun.file("data.txt").text();
      return Response.json({ content });
    }
    
    // 文件写入 API
    if (url.pathname === "/api/write" && req.method === "POST") {
      const { content } = await req.json();
      await Bun.write("data.txt", content);
      return Response.json({ success: true });
    }
    
    // 配置读取 API
    if (url.pathname === "/api/config/read") {
      ensureConfigExists();
      const configContent = await Bun.file("bake_config.json").text();
      return new Response(configContent, {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 配置写入 API
    if (url.pathname === "/api/config/write" && req.method === "POST") {
      const config = await req.json();
      await Bun.write("bake_config.json", JSON.stringify(config, null, 2));
      return Response.json({ success: true });
    }
    
    // 配置重置 API
    if (url.pathname === "/api/config/reset" && req.method === "POST") {
      await Bun.write("bake_config.json", JSON.stringify(DEFAULT_CONFIG, null, 2));
      return new Response(JSON.stringify(DEFAULT_CONFIG), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 路径选择 API
    if (url.pathname === "/api/select-path" && req.method === "POST") {
      try {
        // 解析请求体
        const data = await req.json();
        console.log("路径选择请求:", data);
        
        // 调用系统文件选择对话框
        try {
          const selectedPath = await selectPath(data.type);
          return Response.json({ 
            path: selectedPath,
            success: true
          });
        } catch (error) {
          console.error("文件选择错误:", error.message);
          // 用户可能取消了选择，这不是服务器错误
          return Response.json({ 
            success: false,
            error: "路径选择被取消或失败",
            message: error.message 
          });
        }
      } catch (error) {
        console.error("处理路径选择请求时出错:", error);
        return Response.json({ 
          error: "处理请求失败", 
          message: error.message 
        }, { status: 500 });
      }
    }
    
    // 处理所有其他请求
    console.log(`未找到路由: ${url.pathname}`);
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`服务器正在运行: http://localhost:${server.port}`);
console.log("可用的API端点:");
console.log("- GET  /api/health-check    - 健康检查");
console.log("- GET  /api/config/read     - 读取配置");
console.log("- POST /api/config/write    - 写入配置");
console.log("- POST /api/config/reset    - 重置配置");
console.log("- POST /api/select-path     - 选择路径");
