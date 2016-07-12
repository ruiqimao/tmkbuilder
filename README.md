# TMK Firmware Builder

## Running
**Note**: This will ONLY work on OSX and Linux systems! It is not configured to work with Windows.

Make sure you have `node`, `npm`, and `avr-gcc` installed, along with any other dependencies they may have.

Edit `www/js/constants.js` and `server/constants.js` to adjust the API server location and port to meet your system's requirements.

Go into the `server` directory and install dependencies and start the API server:
```
npm install
node index.js
```

Then, go into the `www` directory and start a web server:

*Python 3.x*:
```
python -m http.server 8080
```

*Python 2.x*:
```
python -m SimpleHTTPServer 8080
```

Then, access the GUI from `http://localhost:8080`.

## Contributing

Since this is not your ordinary open source project, there is no license, which means all standard copyright laws apply. However, feel free to submit pull requests to add/change features and preset layouts! Especially preset layouts! We need lots of those.

All preset layouts go in `/www/js/presets` and must be named appropriately (e.g. `phantom-iso.json`). Edit `www/index.html` to add it to the list of all presets.
