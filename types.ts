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

enum AuthType {
  None = "NONE",
  OAuth2 = "OAUTH2",
  Key = "KEY",
  UserPassword = "USER_PASS"
}

interface GetAuthTypeResponse {
  type: AuthType;
}

interface SetCredentialsRequest {
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
