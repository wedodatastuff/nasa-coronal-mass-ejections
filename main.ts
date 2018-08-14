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

  const rows = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let itemAnalysis = {};

    for (let j = 0; j < item.cmeAnalyses.length; j++) {
      if (item.cmeAnalyses[j].isMostAccurate) {
        itemAnalysis = item.cmeAnalyses[j];
        break;
      }
    }

    const values = [];
    for (let k = 0; k < request.fields.length; k++) {
      const field = request.fields[k];
      values.push(FIELD_MAPPING[field.name](item, itemAnalysis));
    }

    rows.push({ values: values });
  }

  const schemaSubset = requestedFieldsToSchema(request.fields, SCHEMA);
  const result = {
    schema: schemaSubset,
    rows: rows,
    cachedData: false
  };

  logExit("getData", result);
  return result;
}

var FIELD_MAPPING = {
  activityID: function(i, ia) {
    return i.activityID;
  },
  startTime: function(i, ia) {
    return dateToYMDH(new Date(i.startTime));
  },
  sourceLocation: function(i, ia) {
    return i.sourceLocation;
  },
  activeRegionNum: function(i, ia) {
    return i.activeRegionNum;
  },
  cmeAnalysisTime21_5: function(i, ia) {
    return dateToYMDH(new Date(ia.time21_5));
  },
  cmeAnalysisLatitudeLongitude: function(i, ia) {
    return "" + ia.latitude + "," + ia.longitude;
  },
  cmeAnalysisHalfAngle: function(i, ia) {
    return ia.halfAngle;
  },
  cmeAnalysisSpeed: function(i, ia) {
    return ia.speed;
  },
  cmeAnalysisType: function(i, ia) {
    return ia.type;
  },
  cmeAnalysisNote: function(i, ia) {
    return ia.note;
  },
  cmeAnalysisLevelOfData: function(i, ia) {
    return ia.levelOfData;
  },
  note: function(i, ia) {
    return i.note;
  },
  catalog: function(i, ia) {
    return i.catalog;
  }
};

/** Called by auth.js to perform an actual test of the credentials. */
function testCredentials(credentials: KeyUserPassCredentials): boolean {
  logEntry("testCredentials", credentials);

  const url = "https://api.nasa.gov/DONKI/CME" + "?api_key=" + credentials.key;
  let valid = false;

  try {
    const response = UrlFetchApp.fetch(url);
    valid = response.getResponseCode() === 200;
  } catch (err) {
    // Intentional no-op
  }

  logExit("testCredentials", valid);
  return valid;
}
