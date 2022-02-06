"""
Wrapper: Infinite Launcher
"""
version = '1.3.0'

import os
import PySimpleGUI as sg
import subprocess
import pickle

settings = {
    "app_chromium": 1
}

pickle_out = open("utilities/settings.pickle","wb")
pickle.dump(settings, pickle_out)
pickle_out.close()

"""
start wrapper
"""
subprocess.Popen(['utilities/ungoogled-chromium/chrome.exe', '--allow-outdated-plugins', '--user-data-dir=utilities/ungoogled-chromium/the_profile', '--app=http://localhost:4343'])
subprocess.Popen('npm start', shell=True, cwd='wrapper/')

"""
create the window
"""
sg.theme('DarkTeal9') # set theme
sg.theme_border_width(0) # make all buttons flat
options_layout = [
    sg.Button('Open video list'),
    sg.Button('FAQ'),
    sg.Button('Discord server')
]
dev_options_layout = [
    sg.Button('Open project folder'),
    sg.Button('Wipe save')
]
settings_layout = [
    sg.Button('Open video list')
]
layout = [  
    [sg.Text('Wrapper: Infinite', font='Any 20')],
    [sg.Text('A project from Tetradual', font='Any 12')],
    [sg.TabGroup([
        [ sg.Tab('Standard options', [options_layout]), sg.Tab('Developer options', [dev_options_layout]), sg.Tab('Settings', [settings_layout]) ]
    ])],
    [sg.Button('Exit')]
]

window = sg.Window(f'Wrapper: Infinite v{version}', layout, enable_close_attempted_event=True)

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