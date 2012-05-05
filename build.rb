# -*- encoding: UTF-8 -*-
# original https://gist.github.com/715378
# 2.0.1.GA2用にパスのみ改善

TITANIUM_VERSION = '2.0.1.GA2'
BUILD_PATH = "/Library/Application Support/Titanium/mobilesdk/osx/#{TITANIUM_VERSION}/iphone/builder.py"

require 'webrick'

server = WEBrick::HTTPServer.new({
  :DocumentRoot => nil,
  :BindAddress => '0.0.0.0',
  :Port => 9090
})

['INT', 'TERM'].each {|signal|
  Signal.trap(signal){ server.shutdown }
}

last_pid = nil

server.mount_proc("/run") { |req, res|
  if last_pid
    Process.kill('KILL', last_pid)
  end

  last_pid = fork do
        exec "#{BUILD_PATH}", "run", Dir.pwd
  end
  # system "coffee -o "+Dir.pwd+"/Resources/js/ -c "+Dir.pwd+"/Resources/coffee/"
  res["content-type"] = "text/html; charset=utf-8"
  res.body = "ok"
}
warn 'starting server at localhost:9090'
server.start
