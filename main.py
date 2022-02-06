"""
Wrapper: Infinite Launcher
Author: tetradual#1525
License: MIT
"""
version = '1.3.0'

"""
initialization
"""

import os
import PySimpleGUI as sg
import subprocess
import pickle

# make sure we're starting in the correct folder (otherwise things would go horribly wrong)
if (not os.path.isdir('utilities') or not os.path.isdir('wrapper')):
    sg.popup('Doesn\'t seem like this program is in a Wrapper: Infinite folder.')
    exit()

# patch detection
if os.path.isfile('patch.jpg'):
    sg.theme('DarkRed')
    sg.popup('candypaper nointernet PATCHED edition', 'OH MY GODDDDD', 'SWEETSSHEET LACKOFINTERNS PATCHED DETECTED!!!!!!!!!!!!', 'can never be use again...', 'whoever put patch.jpeg back, you are grounded grounded gorrudjnmed for 6000', 'g r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r r')
    exit()

try: # load settings
    settings = pickle.load(open('utilities/settings.pickle', 'rb'))
except (OSError, IOError) as e: # create file if it doesn't exist
    settings = {
        'app_chromium': True,
        'check_dependencies': True
    }
    pickle.dump(settings, open('utilities/settings.pickle', 'wb'))

"""
start wrapper
"""
subprocess.Popen(['utilities/ungoogled-chromium/chrome.exe', '--allow-outdated-plugins', '--user-data-dir=utilities/ungoogled-chromium/the_profile', '--app=http://localhost:4343'])
subprocess.Popen('npm start', shell=True, cwd='wrapper/')

"""
functions
"""
def saveSettings():
    pickle.dump(settings, open('utilities/settings.pickle', 'wb'))

"""
create the window
"""
sg.theme('DarkTeal9') # set theme
sg.theme_border_width(0) # make all buttons flat

# layouts
options_layout = [
    sg.Button('Open video list'),
    sg.Button('FAQ'),
    sg.Button('Discord server')
]
dev_layout = [
    sg.Button('Open project folder'),
    sg.Button('Wipe save')
]
settings_layout = [
    sg.Checkbox('Headless mode', default=settings['app_chromium']),
    sg.Checkbox('Check for dependencies', default=settings['check_dependencies'])
]
layout = [  
    [sg.Text('Wrapper: Infinite', font='Any 20')],
    [sg.Text('A project from Tetradual', font='Any 12')],
    [sg.TabGroup([
        [sg.Tab('Standard options', [options_layout]), sg.Tab('Developer options', [dev_layout]), sg.Tab('Settings', [settings_layout])]
    ])],
    [sg.Button('Exit')]
]

window = sg.Window(f'Wrapper: Infinite v{version}', layout, enable_close_attempted_event=True)

"""
options
"""
while True:
    event, values = window.read()
    if (event == sg.WINDOW_CLOSE_ATTEMPTED_EVENT or event == 'Exit'
        and sg.popup_yes_no('Are you sure you want to exit Infinite?')): # if user closes window or clicks cancel
        exit()
        break
# close the window on exit
window.close()


def exit():
    os.kill()