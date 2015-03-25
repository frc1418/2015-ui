@echo off

cd %~dp0
py -3 driverStationServer.py --host 10.14.18.2
pause