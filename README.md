# Waglys-TA-Extension
A script for Waglys with extended functionality for supervisors. 

# Features
- **Notification sound:** A [jingle](https://soundbible.com/mp3/service-bell_daniel_simion.mp3) is played when the list is updated with a new entry.
- **Copy text button:** Copies the title of an entry on the waiting list.
- **Zoom button:** Tries to parse a zoom-id (and password) from an entry on the waiting list. Opens a new window and attempts to join a zoom call with the parsed id. Also copies the parsed password to clipboard.

# Example
![WithScript](https://user-images.githubusercontent.com/56638070/137086266-78179c7f-1511-44ac-b864-6e84fa347426.png)

Parsed values on hover:
![Hover](https://user-images.githubusercontent.com/56638070/137086399-fc9ad060-9d32-44fc-8df0-f27b5742d805.png)

# How to use
1. Log in to Waglys, **only works if you are a moderator for the Waglys-list**
2. Copy the script from [WaglysExtensionScript.js](https://github.com/OlofSjogren/Waglys-Supervisor-Extension/blob/main/WaglysExtensionScript.js)
3. Paste the script in the browser console and press `Enter`.
   1. Default shortcut to open console on Chrome: `ctrl+shift+j`
   2. **Note:** You should hear an initial sound if it is working.
