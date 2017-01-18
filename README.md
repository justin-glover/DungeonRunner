# Dungeon Runner v 0.1

This app (built in electron) is mainly for running D&D 5E as a DM, but can also be used by the players. Eventual plans to port to mobile. Some instructions to get started with electron below.

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start/).

## To Use

To run this app you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Go into the repository
# Install dependencies
npm install
# Run the app
npm start
```

You will also need the following packages:

- `nedb`
- `promise`

Learn more about Electron and its API in the [documentation](http://electron.atom.io/docs/).
