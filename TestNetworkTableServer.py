#!/usr/bin/env python3
#
# This is supposed to be a testNetworkTable Server on the robot
#it should take values and spit them back
#     SmartDashboard.jar ip 127.0.0.1
#

import sys
from networktables import NetworkTable# To see messages from networktables, you must setup logging
import logging
logging.basicConfig(level=logging.DEBUG)

sd = NetworkTable.getTable("SmartDashboard")
sd.putString('ServerMessage','Success!')
