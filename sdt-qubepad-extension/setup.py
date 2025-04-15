__import__("setuptools").setup()

# import json
# from pathlib import Path
# import os
# from glob import glob
# from setuptools import setup, find_packages

# HERE = Path(__file__).parent.resolve()  # ~/sdt-qubepad-extension

# # Get the package info from package.json
# pkg_json = json.loads((HERE / "package.json").read_bytes())
# lab_path = os.path.join(HERE, "sdt_qubepad_extension", "labextension")

# # The name of the project
# name = "sdt_qubepad_extension"
# version = (
#     pkg_json["version"]
#     .replace("-alpha.", "a")
#     .replace("-beta.", "b")
#     .replace("-rc.", "rc")
# )

# setup(
#     name=name,
#     version=version,
#     description=pkg_json["description"],
#     author=pkg_json["author"],
#     license=pkg_json["license"],
#     packages=find_packages(),
#     include_package_data=True,
#     zip_safe=False,
#     install_requires=["jupyterlab>=4.0.0,<5"],
#     data_files=[
#         (
#             "etc/jupyter/jupyter_server_config.d",
#             ["jupyter-config/sdt_qubepad_extension.json"],
#         ),
#         (
#             "share/jupyter/labextensions/sdt-qubepad-extension",
#             [os.path.join(lab_path, f) for f in ["package.json", "install.json"]],
#         ),
#         (
#             "share/jupyter/labextensions/sdt-qubepad-extension/static",
#             glob(os.path.join(lab_path, "static", "*")),
#         ),
#     ],
#     classifiers=[
#         "Framework :: Jupyter",
#         "Programming Language :: Python :: 3",
#         "License :: OSI Approved :: MIT License",
#     ],
# )