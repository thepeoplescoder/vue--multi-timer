# multi-timer

A basic multi timer application, written in Vue.js.

## Why Write It?

At the last company I was working for, I was a software engineer
working on a healthcare project using Vue.js.  I was hoping to
grow my knowledge of AWS and Vue.js while in that role, but my
entire team was unfortunately laid off.

Determined to continue practicing Vue.js, I figured a timer
application would be a great way to do so.  Why?  Because a
timer application:
* Requires that update events be handled within specific intervals
* Needs state management to be useful
* Needs user input to be useful
* Is a simple, but complex enough application for building
  skills using a frontend framework
  * The UI can benefit from a component-based approach

Also, I have tasks that require me to keep track of them with
multiple timers, and all of the applications that exist currently
don't meet my needs.

## Requirements

1. [Node.js][node-js-homepage]
   * Currently, I have been developing this app using **npm 10.2.4**
     and **Node.js v20.11.0**.  That may change over time.
   * **If you are concerned with negatively impacting your
     current installation of Node.js**, I would recommend
     using a tool that allows you to run multiple versions of
     Node side by side:
     * **For \*nix**, use [nvm][nvm-homepage]
     * **For Windows**, use [nvm-windows][nvm-windows-homepage]

## How to Run

Assuming the requirements [above](#requirements) have been met:

1. First, clone this repository and change into its directory
   if you haven't done so already:
   ```sh
   # Cloning to multi-timer isn't required, it just makes things easier
   git clone https://github.com/thepeoplescoder/vue--multi-timer multi-timer
   cd multi-timer
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Run the application
   ```sh
   npm run host
   ```
4. From there, point your web browser to any of the URLs
   presented to you.
5. To terminate the web server:
   1. activate the terminal window where the server is running
   2. type `Q`
   3. press `Enter`.

Afterwards, you only need to run `npm run host` to run the
application.

## Current Features

1. Large intervals (up to 10,000 weeks) are supported
2. An audible beep is emitted when a timer runs out
3. Multiple timers can run concurrently

## Current Limitations

1. State management currently not implemented
2. UI is currently "clunky" and under construction
3. Running timers are functional, but severely incomplete
4. Codebase:
   * JavaScript Proxies (which are used extensively by Vue.js)
     do not play nicely with private instance variables of ES6
     classes, so instead of using a `#`, a double underscore
     is used by convention.

## Project Roadmap

The basic timer creation functionality is complete.\
What remains is as follows:

* Settle on a UI/layout for the finished application
  * Entire application aesthetic
  * User input for creating new timers
  * Running timer layout
* Handle state management
  * Deciding between a backend database and local storage
* Users should be able to name and rename timers
* Timers should be searchable by name

[node-js-homepage]:     https://nodejs.org/
[nvm-homepage]:         https://github.com/nvm-sh/nvm
[nvm-windows-homepage]: https://github.com/coreybutler/nvm-windows