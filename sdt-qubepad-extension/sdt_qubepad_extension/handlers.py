from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
import json
import requests

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /sdt-qubepad-extension/get-example endpoint!"
        }))
        
        
class LogHandler(APIHandler):
    # @tornado.web.authenticated
    # def post(self):
    #     data = self.get_json_body()
    #     code = data.get("code", "")
    #     timestamp = data.get("timestamp", "")
    #     self.log.info(f"[셀 실행] {timestamp} - {code}")
    #     self.finish(json.dumps({"status": "ok"}))
    
    @tornado.web.authenticated
    def post(self):
        body = self.get_json_body()
        type = body.get("type", "{}")
        payload = body.get("payload", "{}")
        self.log.info(f"[body] \n{body}")
        self.log.info(f"[body json] \n{json.dumps(body)}")
        self.log.info(f"[type] \n{type}")
        self.log.info(f"[payload] \n{payload}")

        # 외부 API 서버로 전송
        url = 'https://your_ip/api/path'
        data = json.dumps(body)
        headers = {
            'Content-Type': 'application/json',
        }
        # response = requests.post(url=url, data=data, headers=headers)
        
        self.finish(json.dumps({"status": "ok"}))


def setup_handlers(web_app):
    base_url = web_app.settings["base_url"]
    host_pattern = ".*$"
    handlers = []

    route_pattern = url_path_join(base_url, "sdt-qubepad-extension", "get-example")
    handlers.append((route_pattern, RouteHandler))
    
    log_pattern = url_path_join(base_url, "sdt-qubepad-extension", "log")
    handlers.append((log_pattern, LogHandler))
    
    web_app.add_handlers(host_pattern, handlers)
