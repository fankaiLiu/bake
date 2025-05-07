// server.js

//运行在每个用户的电脑上，不是运行在服务器上，所以可以读取到文件
//运行在每个用户的电脑上，不是运行在服务器上，所以可以读取到文件
//运行在每个用户的电脑上，不是运行在服务器上，所以可以读取到文件

import process from 'process'; // 导入 process 模块以获取 cwd
import fs from 'fs/promises'; // Import fs promises for directory reading
import path from 'path'; // Import path for joining paths

// 默认配置
const DEFAULT_CONFIG = {
  sqlPaths: "",
  rustOutputPath: "",
  frontendOutputPath: ""
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

// 读取SQL文件内容
async function readSqlFiles(sqlPath) {
  try {
    const currentWorkingDirectory = process.cwd();
    const fullPath = path.resolve(currentWorkingDirectory, sqlPath);
    
    // 确保路径存在且是目录
    const stats = await fs.stat(fullPath);
    if (!stats.isDirectory()) {
      throw new Error('SQL path is not a directory');
    }

    // 读取目录下的所有文件
    const files = await fs.readdir(fullPath);
    const sqlFiles = files.filter(file => file.endsWith('.sql'));
    
    // 读取所有SQL文件内容并拼接
    const contents = await Promise.all(
      sqlFiles.map(async file => {
        const content = await fs.readFile(path.join(fullPath, file), 'utf-8');
        return content;
      })
    );

    return contents.join('\n');
  } catch (error) {
    console.error('Error reading SQL files:', error);
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
      return new Response(Bun.file("proof/index.html"));
    }
    if (url.pathname === "/config.html") {
      return new Response(Bun.file("proof/config.html"));
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
      // Basic validation: ensure paths are strings
      if (typeof config.sqlPaths !== 'string' || 
          typeof config.rustOutputPath !== 'string' || 
          typeof config.frontendOutputPath !== 'string') {
         return Response.json({ success: false, error: "Invalid config format" }, { status: 400 });
      }
      
      const currentWorkingDirectory = process.cwd();
      
      // 将所有路径转换为相对路径
      const convertToRelativePath = (absolutePath) => {
        if (!absolutePath) return "";
        // 如果路径已经是相对路径，直接返回
        if (!path.isAbsolute(absolutePath)) return absolutePath;
        // 将绝对路径转换为相对路径
        return path.relative(currentWorkingDirectory, absolutePath);
      };
      
      // 转换sqlPaths
      config.sqlPaths = convertToRelativePath(config.sqlPaths);
      
      // 转换输出路径
      config.rustOutputPath = convertToRelativePath(config.rustOutputPath);
      config.frontendOutputPath = convertToRelativePath(config.frontendOutputPath);

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

    // API: 获取当前工作目录 (简化)
    if (url.pathname === "/api/select-path" && req.method === "POST") {
       try {
         const currentWorkingDirectory = process.cwd();
         return Response.json({
           path: currentWorkingDirectory,
           success: true
         });
       } catch (error) {
         console.error("获取当前工作目录时出错:", error);
         return Response.json({
           error: "获取当前工作目录失败",
           message: error.message
         }, { status: 500 });
       }
    }

    // API: 列出指定相对路径下的子目录
    if (url.pathname === "/api/list-dirs" && req.method === "GET") {
      try {
        const currentWorkingDirectory = process.cwd();
        const relativePathQuery = url.searchParams.get('relativePath') || '.'; // Default to current dir

        // 解析目标路径并进行规范化
        const targetPath = path.resolve(currentWorkingDirectory, relativePathQuery);

        // --- 安全检查 ---
        // 确保目标路径在当前工作目录或其子目录下
        if (!targetPath.startsWith(currentWorkingDirectory)) {
          console.warn(`目录遍历尝试被阻止: ${targetPath}`);
          return Response.json({
            error: "禁止访问",
            message: "请求的路径超出允许范围。"
          }, { status: 403 }); // Forbidden
        }

        // 检查路径是否存在且为目录
        const stats = await fs.stat(targetPath);
        if (!stats.isDirectory()) {
           return Response.json({ error: "路径无效", message: "请求的路径不是一个有效的目录。" }, { status: 400 });
        }
        // --- 安全检查结束 ---

        const entries = await fs.readdir(targetPath, { withFileTypes: true });
        const directories = entries
          .filter(dirent => dirent.isDirectory())
          .map(dirent => ({
            name: dirent.name,
            // 返回相对于 CWD 的路径，以便客户端可以再次请求
            relativePath: path.relative(currentWorkingDirectory, path.join(targetPath, dirent.name)) || '.' 
          }));

        // 计算父目录的相对路径 (如果不是 CWD)
        let parentRelativePath = null;
        if (targetPath !== currentWorkingDirectory) {
           parentRelativePath = path.relative(currentWorkingDirectory, path.join(targetPath, '..')) || '.';
        }

        return Response.json({
           directories,
           currentAbsolutePath: targetPath, // 当前列出的目录的绝对路径
           currentRelativePath: path.relative(currentWorkingDirectory, targetPath) || '.', // 当前列出的目录的相对路径
           parentRelativePath: parentRelativePath, // 父目录的相对路径 (或 null)
           success: true
         });

      } catch (error) {
        // 处理文件不存在等错误
        if (error.code === 'ENOENT') {
             return Response.json({ error: "路径无效", message: "请求的路径不存在。" }, { status: 404 });
        }
        console.error("列出目录时出错:", error);
        return Response.json({
          error: "列出目录失败",
          message: error.message
        }, { status: 500 });
      }
    }
    
    // 代码生成 API
    if (url.pathname === "/api/generate" && req.method === "POST") {
      try {
        const { requirements } = await req.json();
        
        // 读取配置文件
        const configContent = await Bun.file("bake_config.json").text();
        const config = JSON.parse(configContent);
        
        // 读取SQL文件内容
        const tableSql = await readSqlFiles(config.sqlPaths);
        
        // 调用本地AI服务
        const aiResponse = await fetch('http://localhost:5800/ai_codegen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_sql: tableSql,
            question: requirements
          })
        });

        if (!aiResponse.ok) {
          throw new Error('AI service request failed');
        }

        const generatedCode = await aiResponse.json();
        return Response.json(generatedCode);
      } catch (error) {
        console.error("代码生成错误:", error);
        return Response.json({ error: "代码生成失败", message: error.message }, { status: 500 });
      }
    }
    
    // 写入文件 API
    if (url.pathname === "/api/write-files" && req.method === "POST") {
      try {
        const { code_files } = await req.json();
        const configContent = await Bun.file("bake_config.json").text();
        const config = JSON.parse(configContent);
        const currentWorkingDirectory = process.cwd();

        // 写入每个文件
        for (const [filePath, content] of Object.entries(code_files)) {
          const fullPath = path.resolve(currentWorkingDirectory, filePath);
          await fs.mkdir(path.dirname(fullPath), { recursive: true });
          await fs.writeFile(fullPath, content, 'utf-8');
        }

        return Response.json({ success: true });
      } catch (error) {
        console.error("写入文件错误:", error);
        return Response.json({ error: "写入文件失败", message: error.message }, { status: 500 });
      }
    }
    
    // 处理所有其他请求
    console.log(`未找到路由: ${url.pathname}`);
    return new Response("Not Found", { status: 404 });
  },
  error(error) { // Add basic error handling for the server itself
      console.error("服务器错误:", error);
      return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`服务器正在运行: http://localhost:${server.port}`);
console.log("可用的API端点:");
console.log("- GET  /api/health-check    - 健康检查");
console.log("- GET  /api/config/read     - 读取配置");
console.log("- POST /api/config/write    - 写入配置");
console.log("- POST /api/config/reset    - 重置配置");
console.log("- POST /api/select-path     - 获取当前工作目录"); // Updated description
console.log("- GET  /api/list-dirs?relativePath=... - 列出指定相对路径下的子目录"); // Updated endpoint description
