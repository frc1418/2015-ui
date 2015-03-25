@echo off

cd %~dp0
py -3 driverStationServer.py --host 127.0.0.1
pause