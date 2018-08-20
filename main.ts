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

/** Set to true for development and testing only. */
const DEBUG = true;

/*******************************************************************************
 * TYPES AND INTERFACES
 ******************************************************************************/

enum AuthType {
  None = "NONE",
  OAuth2 = "OAUTH2",
  Key = "KEY",
  UserPassword = "USER_PASS"
}

interface GetAuthTypeResponse {
  type: AuthType;
}

interface KeyUserPassCredentials {
  key?: string;
  userPass?: UserPass;
}

interface SetCredentialsResponse {}

interface UserPass {
  username: string;
  password: string;
}

interface GetConfigRequest {
  languageCode: string;
}

enum ConfigParamType {
  TextInput = "TEXTINPUT",
  TextArea = "TEXTAREA",
  SelectSingle = "SELECTSINGLE",
  SelectMultiple = "SELECTMULTIPLE",
  Checkbox = "CHECKBOX",
  Info = "INFO"
}

interface ConfigParamControl {
  allowOverride: boolean;
}

interface ConfigParamOption {
  label: string;
  value: string;
}

interface ConfigParam {
  type: ConfigParamType;
  name: string;
  displayName?: string;
  helpText?: string;
  placeholder?: string;
  text?: string;
  parameterControl?: ConfigParamControl;
  options?: ConfigParamOption[];
}

interface GetConfigResponse {
  configParams: ConfigParam[];
  dateRangeRequired?: boolean;
}

enum SchemaFieldDataType {
  String = "STRING",
  Number = "NUMBER",
  Boolean = "BOOLEAN"
}

enum SchemaFieldAggregationType {
  Average = "AVG",
  Count = "COUNT",
  CountDistinct = "COUNT_DISTINCT",
  Max = "MAX",
  Min = "MIN",
  Sum = "SUM"
}

enum SchemaFieldConceptType {
  Dimension = "DIMENSION",
  Metric = "METRIC"
}

enum SchemaFieldSemanticType {
  Year = "YEAR",
  YearQuarter = "YEAR_QUARTER",
  YearMonth = "YEAR_MONTH",
  YearWeek = "YEAR_WEEK",
  YearMonthDay = "YEAR_MONTH_DAY",
  YearMonthDayHour = "YEAR_MONTH_DAY_HOUR",
  Quarter = "QUARTER",
  Month = "MONTH",
  Week = "WEEK",
  MonthDay = "MONTH_DAY",
  DayOfWeek = "DAY_OF_WEEK",
  Day = "DAY",
  Hour = "HOUR",
  Minute = "MINUTE",
  Duration = "DURATION",
  Country = "COUNTRY",
  CountryCode = "COUNTRY_CODE",
  Continent = "CONTINENT",
  ContinentCode = "CONTINENT_CODE",
  SubContinent = "SUB_CONTINENT",
  SubContinentCode = "SUB_CONTINENT_CODE",
  Region = "REGION",
  RegionCode = "REGION_CODE",
  City = "CITY",
  CityCode = "CITY_CODE",
  MetroCode = "METRO_CODE",
  LatitudeLongitude = "LATITUDE_LONGITUDE",
  Number = "NUMBER",
  Percent = "PERCENT",
  Text = "TEXT",
  Boolean = "BOOLEAN",
  Url = "URL",
  Image = "IMAGE"
}

interface SchemaFieldSemantics {
  conceptType: SchemaFieldConceptType;
  semanticType?: SchemaFieldSemanticType;
  semanticGroup?: string; // unused
  isReaggretable?: boolean;
}

interface SchemaField {
  name: string;
  label: string;
  dataType: SchemaFieldDataType;
  semantics: SchemaFieldSemantics;
  description?: string;
  group?: string;
  formula?: string;
  isDefault?: boolean;
  defaultAggregationType?: SchemaFieldAggregationType;
}

interface GetSchemaRequest {
  configParams: object;
  scriptParams: object;
}

interface GetSchemaResponse {
  schema: SchemaField[];
}

interface RequestedField {
  name: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ScriptParams {
  sampleExtraction?: boolean;
  lastRefresh?: string;
}

interface GetDataRequest {
  configParams: object;
  scriptParams: ScriptParams;
  dateRange: DateRange;
  fields: RequestedField[];
}

interface DataRow {
  values: any[];
}

interface GetDataResponse {
  schema: SchemaField[];
  rows: DataRow[];
  cachedData: boolean;
}

enum AuthPropertyName {
  ApiKey = "AUTH_API_KEY",
  Username = "AUTH_USERNAME",
  Password = "AUTH_PASSWORD"
}

/*******************************************************************************
 * DEBUGGING
 ******************************************************************************/

/**
 * Logs a message if DEBUG is true.
 *
 * @param message - message to log
 * @param args - (optional) additional objects to log
 */
function log(message: string, ...args: any[]): void {
  if (DEBUG) console.log(message, ...args);
}

/**
 * Logs the start of a function if DEBUG is true.
 *
 * @param fnName - name of function
 * @param parameters - (optional) parameters passed to function
 */
function logEntry(fnName: string, ...parameters: any[]): void {
  log(`-> ${fnName} `, ...parameters);
}

/**
 * Logs the end of a function if DEBUG is true.
 *
 * @param fnName - name of function
 * @param args - (optional) return value
 */
function logExit(fnName: string, result?: any): void {
  log(`<- ${fnName} `, result);
}

/**
 * Logs an error regardless of the DEBUG setting.
 *
 * @param message - error message
 * @param args - (optional) additional objects to log
 */
function logError(message: string, ...args: any[]): void {
  console.error(message, ...args);
}

/*******************************************************************************
 * UTILITIES
 ******************************************************************************/

/**
 * Converts a Date to a GDS-friendly YYYYMMDDHH string.
 *
 * @param date - date to convert
 */
function dateToYMDH(date: Date): string {
  logEntry("dateToYMDH", date);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();
  const h = date.getUTCHours();

  const ymdh = "" + y + m + d + h;

  logExit("dateToYMDH", ymdh);
  return ymdh;
}

/**
 * Converts a Date to a GDS-friendly YYYYMMDD string.
 *
 * @param date - date to convert
 */
function dateToYMD(date: Date): string {
  logEntry("dateToYMD", date);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();
  const d = date.getUTCDate();

  const ymd = "" + y + m + d;

  logExit("dateToYMD", ymd);
  return ymd;
}

/**
 * Converts a Date to a GDS-friendly YYYYMM string.
 *
 * @param date - date to convert
 */
function dateToYM(date: Date): string {
  logEntry("dateToYM", date);

  const y = date.getUTCFullYear();
  const m = date.getUTCMonth();

  const ym = "" + y + m;

  logExit("dateToYMD", ym);
  return ym;
}

/**
 * Left pads a number.
 *
 * See https://stackoverflow.com/a/10073788/521662.
 *
 * @param num - the number to pad
 * @param width - desired width
 * @param char - pad character, defaults to "0"
 */
function pad(numToPad: number, width: number, padChar: string): string {
  const char = padChar || "0";
  let num = numToPad + "";
  while (num.length < width) {
    num = "" + char + num;
  }

  return num;
}

/**
 * Extracts a subset of the SCHEMA array based on the requested field names.
 *
 * @param requestedFields - list of request fields via the 'name' property
 * @param schema - schema array will all fields
 */
function requestedFieldsToSchema(
  requestedFields: RequestedField[],
  schema: SchemaField[]
) {
  logEntry("requestedFieldsToSchema", requestedFields, schema);

  var subset = [];
  for (let i = 0; i < requestedFields.length; i++) {
    const field = requestedFields[i];
    for (let j = 0; j < schema.length; j++) {
      if (field.name === schema[j].name) {
        subset.push(schema[j]);
        break;
      }
    }
  }

  logExit("requestedFieldsToSchema", subset);
  return subset;
}

/*******************************************************************************
 * AUTHORIZATION
 ******************************************************************************/

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
    userProperties.setProperty(AuthPropertyName.ApiKey, request.key);
  } else if (request.userPass) {
    userProperties.setProperty(
      AuthPropertyName.Username,
      request.userPass.username
    );
    userProperties.setProperty(
      AuthPropertyName.Password,
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
  const key = userProperties.getProperty(AuthPropertyName.ApiKey);
  const username = userProperties.getProperty(AuthPropertyName.Username);
  const password = userProperties.getProperty(AuthPropertyName.Password);
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

  let valid = false;
  const credentials = getCredentials();

  if (credentials) {
    const url =
      "https://api.nasa.gov/DONKI/CME" + "?api_key=" + credentials.key;

    try {
      const response = UrlFetchApp.fetch(url);
      valid = response.getResponseCode() === 200;
    } catch (err) {
      // Intentional no-op
    }
  }

  logExit("isAuthValid", valid);
  return valid;
}

/** Called by GDS to clear out any stored credentails. */
function resetAuth(): void {
  logEntry("resetAuth");

  const userProperties = PropertiesService.getUserProperties();
  userProperties.deleteProperty(AuthPropertyName.ApiKey);
  userProperties.deleteProperty(AuthPropertyName.Username);
  userProperties.deleteProperty(AuthPropertyName.Password);

  logExit("resetAuth");
}

/** Creates a masked version of KeyUserPassCredentials. */
function getMaskedCredentials(
  credentials: KeyUserPassCredentials
): KeyUserPassCredentials {
  let masked: KeyUserPassCredentials = null;

  if (credentials) {
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
  }

  return masked;
}

/*******************************************************************************
 * GOOGLE DATA STUDIO ENTRY POINTS
 ******************************************************************************/

/**
 * Called by GDS to determine if it should provide additional debugging
 * information in Data Studio.
 */
function isAdminUser(): boolean {
  logEntry("isAdminUser");
  logExit("isAdminUser", DEBUG);
  return DEBUG;
}

/**
 * Called by GDS to determine if any additional data should be collected from
 * the user and passed to getData().
 *
 * See https://developers.google.com/datastudio/connector/reference#getconfig
 *
 * @param request.languageCode {string} user's language (en, it, ...)
 */
function getConfig(request: GetConfigRequest): GetConfigResponse {
  logEntry("getConfig", request);

  const config: GetConfigResponse = {
    configParams: [
      {
        type: ConfigParamType.Info,
        name: "info",
        text: "The connector is now ready to use."
      }
    ],
    dateRangeRequired: true // ensures dates sent to getData()
  };

  logExit("getConfig", config);
  return config;
}

/** Schema fields for this connector. */
const SCHEMA: SchemaField[] = [
  {
    name: "activityID",
    label: "Activity ID",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension
    }
  },
  {
    name: "startTime",
    label: "Start Time",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension,
      semanticType: SchemaFieldSemanticType.YearMonthDayHour
    }
  },
  {
    name: "sourceLocation",
    label: "Source Location",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension
    }
  },
  {
    name: "activeRegionNum",
    label: "Active Region",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension
    }
  },
  {
    name: "cmeAnalysisTime21_5",
    label: "CME Time",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension,
      semanticType: SchemaFieldSemanticType.YearMonthDayHour
    }
  },
  {
    name: "cmeAnalysisLatitudeLongitude",
    label: "CME Latitude and Longitude",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension,
      semanticType: SchemaFieldSemanticType.LatitudeLongitude
    }
  },
  {
    name: "cmeAnalysisHalfAngle",
    label: "CME Half Angle",
    dataType: SchemaFieldDataType.Number,
    semantics: {
      conceptType: SchemaFieldConceptType.Metric,
      semanticType: SchemaFieldSemanticType.Number
    },
    defaultAggregationType: SchemaFieldAggregationType.Average
  },
  {
    name: "cmeAnalysisSpeed",
    label: "CME Speed",
    dataType: SchemaFieldDataType.Number,
    semantics: {
      conceptType: SchemaFieldConceptType.Metric,
      semanticType: SchemaFieldSemanticType.Number
    },
    defaultAggregationType: SchemaFieldAggregationType.Average
  },
  {
    name: "cmeAnalysisType",
    label: "CME Type",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension
    }
  },
  {
    name: "cmeAnalysisNote",
    label: "CME Note",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension,
      semanticType: SchemaFieldSemanticType.Text
    }
  },
  {
    name: "cmeAnalysisLevelOfData",
    label: "CME Level of Data",
    dataType: SchemaFieldDataType.Number,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension,
      semanticType: SchemaFieldSemanticType.Number
    }
  },
  {
    name: "note",
    label: "Note",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension,
      semanticType: SchemaFieldSemanticType.Text
    }
  },
  {
    name: "catalog",
    label: "Catalog",
    dataType: SchemaFieldDataType.String,
    semantics: {
      conceptType: SchemaFieldConceptType.Dimension
    }
  }
];

/**
 * Called by GDS to get the schema for the data returned by getData().
 *
 * See https://developers.google.com/datastudio/connector/reference#getschema
 *
 * @param request - contains config values provided by the user
 */
function getSchema(request: GetSchemaRequest): GetSchemaResponse {
  logEntry("getSchema", request);

  const schema = { schema: SCHEMA };

  logExit("getSchema", schema);
  return schema;
}

/**
 * Called by GDS to get data from the underlying API or datastore. Converts
 * the data returned by the source to the schema defined by getSchema().
 *
 * See https://developers.google.com/datastudio/connector/reference#getdata
 *
 * @param request - configuration parameters and more
 */
function getData(request: GetDataRequest): GetDataResponse {
  logEntry("getData", request);

  const data = fetchData(request);
  const rows = transformData(request, data);

  const schemaSubset = requestedFieldsToSchema(request.fields, SCHEMA);
  const result = {
    schema: schemaSubset,
    rows: rows,
    cachedData: false
  };

  logExit("getData", result);
  return result;
}

/**
 * Fetches data from the underlying API or datastore.
 *
 * @param request - information passed to getData()
 */
function fetchData(request: GetDataRequest): any {
  logEntry("fetchData", request);

  const credentials = getCredentials();
  const startDate = request.dateRange.startDate;
  const endDate = request.dateRange.endDate;
  const url =
    "https://api.nasa.gov/DONKI/CME" +
    "?api_key=" +
    credentials.key +
    "&startDate=" +
    startDate +
    "&endDate=" +
    endDate;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  logExit("fetchData", data);
  return data;
}

/**
 * Transforms data obtained from the underlying API or datastore to the schema
 * expected by GDS.
 *
 * @param request - information passed to getData()
 * @param data - from the underlying API or datastore
 */
function transformData(request: GetDataRequest, data: any): DataRow[] {
  logEntry("transformData", data);

  const rows = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let itemAnalysis = null;

    if (!item.cmeAnalyses) {
      continue;
    }

    for (let j = 0; j < item.cmeAnalyses.length; j++) {
      if (item.cmeAnalyses[j].isMostAccurate) {
        itemAnalysis = item.cmeAnalyses[j];
        break;
      }
    }
    if (!itemAnalysis) {
      itemAnalysis = item.cmeAnalyses[0];
    }

    const values = [];
    for (let k = 0; k < request.fields.length; k++) {
      const field = request.fields[k];
      values.push(DATA_TO_SCHEMA_MAP[field.name](item, itemAnalysis));
    }

    rows.push({ values: values });
  }

  logExit("transformData", rows);
  return rows;
}

const DATA_TO_SCHEMA_MAP = {
  activityID: (i, ia) => i.activityID,
  startTime: (i, ia) => dateToYMDH(new Date(i.startTime)),
  sourceLocation: (i, ia) => i.sourceLocation,
  activeRegionNum: (i, ia) => i.activeRegionNum,
  cmeAnalysisTime21_5: (i, ia) => dateToYMDH(new Date(ia.time21_5)),
  cmeAnalysisLatitudeLongitude: (i, ia) =>
    "" + ia.latitude + "," + ia.longitude,
  cmeAnalysisHalfAngle: (i, ia) => ia.halfAngle,
  cmeAnalysisSpeed: (i, ia) => ia.speed,
  cmeAnalysisType: (i, ia) => ia.type,
  cmeAnalysisNote: (i, ia) => ia.note,
  cmeAnalysisLevelOfData: (i, ia) => ia.levelOfData,
  note: (i, ia) => i.note,
  catalog: (i, ia) => i.catalog
};
