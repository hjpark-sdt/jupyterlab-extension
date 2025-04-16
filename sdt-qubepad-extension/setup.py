# setup.py 보다 pyproject.toml 이 우선시 된다.
# pyproject.toml 내에 build-backend = "hatchling.build" 이 설정되어 있으므로, 
# 빌드 시스템으로 hatchling이 설정되고, setuptools는 사용되지 않아 setup.py는 무시된다.

__import__("setuptools").setup()