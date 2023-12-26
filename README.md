# Logging

A self used logging framework.

## Features

- [✓] Logging levels
- [✓] Logging to console
- [✓] Logging to file
- [✓] Logging to custom output
- [✓] Logging formatting
- [✓] Logging rotation
- [✓] Logging filtering

## Installation

```bash
npm install @taketo/logging --save
```

## Usage

1. Create a new configuration file `logging.yml` or `logging.yaml` in the project's root directory.

2. Fill in the configuration file with your custom settings.

    Example `logging.yml`:

    ```yaml
    # Logging Configuration

    logging:
    template: "%timestamp%%level%%label%%module%%message%%metadata%"
    formats:
        timestamp: "YYYY.MM.DD-HH:mm:ss.SSS ZZ"
        label: logging
        json: false
        pad: true
        align: false
        attributeformat:
        level: " %attribute%"
        label: " [%attribute%]"
        module: " [%attribute%] "
        metadata: " (%attribute%)"
        colorize:
        all: true
        colors:
            info: green
            error: red
            warn: yellow
            debug: grey
    targets:
        console:
        target: console
        enabled: true
        options:
            level: info
        file:
        target: file
        enabled: true
        options:
            level: warn
            filename: "logging.log"
        rotatingInfo:
        target: daily-rotate-file
        enabled: true
        options:
            level: info
            datePattern: "YYYY-MM-DD"
            zippedArchive: true
            filename: "logs/%DATE%/info.log"
            options:
            flags: a
            mode: 0666
        rotatingDebug:
        target: daily-rotate-file
        enabled: true
        options:
            level: debug
            datePattern: "YYYY-MM-DD"
            zippedArchive: true
            filename: "logs/%DATE%/debug.log"
            options:
            flags: a
            mode: 0666
        rotatingWarn:
        target: daily-rotate-file
        enabled: true
        options:
            level: warn
            datePattern: "YYYY-MM-DD"
            zippedArchive: true
            filename: "logs/%DATE%/warn.log"
            options:
            flags: a
            mode: 0666
        rotatingError:
        target: daily-rotate-file
        enabled: true
        options:
            level: error
            datePattern: "YYYY-MM-DD"
            zippedArchive: true
            filename: "logs/%DATE%/error.log"
            options:
            flags: a
            mode: 0666
    ```

3. Import the `LoggingFactory` package in your project.

    Example in Node.js:

    ```javascript
    const LoggingFactory = require('@taketo/logging');

    // Use the LoggingFactory to configure and create loggers
    const logger = LoggingFactory.getLogger('name');
    ```

4. Use the logger to print logs in your code.

    Example usage:

    ```javascript
    // Log an error message
    logger.error("This is an error message.");

    // Log a warning message
    logger.warn("This is a warning message.");

    // Log an informational message
    logger.info("This is an informational message.");

    // Log a debug message
    logger.debug("This is a debug message.");
    ```

## Default Logging Configuration

```yaml
logging:
  # Configurations related to the logging mechanism
  # Specifies the message structure through placeholders
  template: "%timestamp%%level%%label%%module%%message%%metadata%"
  # Enables the different formats to apply to the log messages FOR ALL transports
  # Each format can be disabled by setting it to false
  formats:
    # Adds a timestamp to the messages with the following format
    timestamp: "YYYY.MM.DD-HH:mm:ss.SSS"
    # Adds a specified label to every message. Useful for distributed workers scenario
    label: logging
    # serializes the log messages as JSON
    json: false
    # pads the levels to be the same length
    pad: true
    # adds a tab delimiter before the message to align it in the same place
    align: true
    # specifies formatting strings for different log message attributes
    attributeformat:
      # add a space before the level
      level: " %attribute%"
      # put [] around the label and space before it
      label: " [%attribute%]"
      # put [] around the module name and space before/after it
      module: " [%attribute%] "
      # put () around the metadata and space before it
      metadata: " (%attribute%)"
    # defines coloring for the different levels for each (or all) message property
    colorize:
      # Apply it to levels
      level: true
      # Apply it to messages
      message: false
      # The colors for each level
      colors:
        info: green
        error: red
        warn: yellow
        debug: grey
  # Lists the targets (winston transports)
  targets:
    console:
      target: console # Defines a console target
      enabled: true # Enables the target
      options: # These are passed to the winston console target as-is
        level: info
    # Defines a file target with debug level but is disabled by default
    file:
      target: file
      enabled: false
      options:
        level: debug
        filename: logging.log
        maxSize: 5m
        zippedArchive: false
        options:
          flags: a
          mode: 0666
```
