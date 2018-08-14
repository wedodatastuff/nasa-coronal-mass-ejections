/**
 * Copyright © 2018 Seth Livingston.
 * License: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

enum AuthProperty {
  ApiKey = "AUTH_API_KEY",
  Username = "AUTH_USERNAME",
  Password = "AUTH_PASSWORD"
}

/**
 * Called by GDS to determine which information it needs to collect from the
 * user for authentication. The information it collects is sent to this
 * connector in a subsequent call to setCredentials().
 */
function getAuthType(): GetAuthTypeResponse {
  logEntry("getAuthType");

  const authType = {
    type: AuthType.Key
  };

  logExit("getAuthType", authType);
  return authType;
}

/**
 * Called by GDS to provide the username and password OR the API key it
 * collected from the user. See getAuthType(). This function stores the
 * credentials and returns a code indicating success.
 *
 * @param request - username/password or API key
 */
function setCredentials(
  request: KeyUserPassCredentials
): SetCredentialsResponse {
  logEntry("setCredentials", request);

  const userProperties = PropertiesService.getUserProperties();
  if (request.key) {
    userProperties.setProperty(AuthProperty.ApiKey, request.key);
  } else if (request.userPass) {
    userProperties.setProperty(
      AuthProperty.Username,
      request.userPass.username
    );
    userProperties.setProperty(
      AuthProperty.Password,
      request.userPass.password
    );
  }

  logExit("setCredentials", getMaskedCredentials(request));
  return { errorCode: "NONE" };
}

/**
 * Convenience function used by other functions in this connector to get the
 * credentials we stored when GDS called setCredentials(). The object
 * returned is the same object passed into setCredentials().
 */
function getCredentials(): KeyUserPassCredentials {
  logEntry("getCredentials");

  const userProperties = PropertiesService.getUserProperties();
  const key = userProperties.getProperty(AuthProperty.ApiKey);
  const username = userProperties.getProperty(AuthProperty.Username);
  const password = userProperties.getProperty(AuthProperty.Password);
  let credentials: KeyUserPassCredentials = null;

  if (key) {
    credentials = {
      key
    };
  } else if (username || password) {
    credentials = {
      userPass: {
        username,
        password
      }
    };
  }

  logExit("getCredentials", getMaskedCredentials(credentials));
  return credentials;
}

/**
 * Called by GDS to ensure that the credentials collected from the user are
 * valid credentials.
 */
function isAuthValid(): boolean {
  logEntry("isAuthValid");

  const credentials = getCredentials();
  const valid = testCredentials(credentials);

  logExit("isAuthValid", valid);
  return valid;
}

/** Called by GDS to clear out any stored credentails. */
function resetAuth(): void {
  logEntry("resetAuth");

  const userProperties = PropertiesService.getUserProperties();
  userProperties.deleteProperty(AuthProperty.ApiKey);
  userProperties.deleteProperty(AuthProperty.Username);
  userProperties.deleteProperty(AuthProperty.Password);

  logExit("resetAuth");
}

/** Creates a masked version of KeyUserPassCredentials. */
function getMaskedCredentials(
  credentials: KeyUserPassCredentials
): KeyUserPassCredentials {
  let masked: KeyUserPassCredentials = null;

  if (credentials.key) {
    masked = {
      key: "****"
    };
  } else if (credentials.userPass) {
    masked = {
      userPass: {
        username: credentials.userPass.username ? "****" : null,
        password: credentials.userPass.password ? "****" : null
      }
    };
  }

  return masked;
}
