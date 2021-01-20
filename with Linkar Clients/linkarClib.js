var LinkarClient = require('./LinkarClientJS.js')

function process_result(transaction, result){
  hasError = result['hasError']
  lkString = result['lkString']
  if(hasError){
      console.log("Error while " + transaction)
    console.log(lkString.readCString())
      process.exit(0)
  }else{
      // Check Errors in transaction
      var lstError = linkar_client.LkGetErrorsFromLkString(lkString)
      if (lstError.length > 0){
        console.log("Found " + lstError.length + " errors in '" + transaction + "' transaction")
        console.log(lstError)
      }else{
        console.log("No errors in transaction!")
      }

      // Retrieve created record
      var lstRecordIds = linkar_client.LkGetRecordIdsFromLkString(lkString)
      var lstRecord = linkar_client.LkGetRecordsFromLkString(lkString)
      return {'lstError': lstError, 'lstRecordIds':lstRecordIds, 'lstRecord':lstRecord}
  }
  return {'lstError': [], 'lstRecordIds': [], 'lstRecord': []}
}

/********************************/
/* SCRIPT ENTRY POINT           */
/********************************/

console.log("project start")
var linkar_client = new LinkarClient.LinkarClient()

var DBMV_Mark_AM = Buffer.from([0xFE]);
var DBMV_Mark_VM = Buffer.from([0xFD]);
var DBMV_Mark_AM_utf8 = "\uFFFD";

var customVars = ''
var receiveTimeout = -1


////////////////
// LkLogin
////////////////
console.log("LkLogin")
console.log("--------")
var crdOpt = linkar_client.LkCreateCredentialOptions(
		"127.0.0.1",		// Linkar Server IP or Hostname
		"EP_NAME",			// EntryPoint Name
		11300,				// Linkar Server EntryPoint port
		"user",				// Linkar Server Username
		"password",			// Linkar Server Username Password
		"",					// Language
		"Test Node.js")		// Free text

var port = linkar_client.LkGetDataFromCredentialOptions(crdOpt, LinkarClient.CredentialOptions.PORT)
console.log("PORT: " + port)

var output = linkar_client.LkLogin(crdOpt, "", 600)
var connectionInfo = output['lkString']
var hasError = output['hasError']
if( hasError ){
  console.log("Failed Login")
  console.log(output['lkString'].readCString())
  process.exit()
}
result = linkar_client.LkGetDataFromConnectionInfo(connectionInfo, LinkarClient.ConnectionInfo.SESSION_ID)
console.log( "SessionId:"+ result )

////////////////
// LkNew
////////////////
console.log("-- LkNew --")
console.log("--------")
var filename = 'LK.CUSTOMERS'
var strNewId = 'A90'
// Create allocated buffer
local = Buffer.concat([Buffer.from('CUSTOMER 99'), DBMV_Mark_AM, Buffer.from('ADDRESS 99'), DBMV_Mark_AM, Buffer.from('999 - 999 - 99')])
strNewRecord = linkar_client.LkAllocateBuffer(local)
var nop_newItemIdTypeNone = linkar_client.LkCreateNewRecordIdTypeNone()
var nop_readAfter = true
var nop_calculated = false
var nop_conversion = false
var nop_formatSpec = false
var nop_originalRecords = false
var newOptions = linkar_client.LkCreateNewOptions(nop_newItemIdTypeNone,
                                                        nop_readAfter, nop_calculated,
                                                        nop_conversion, nop_formatSpec,
                                                        nop_originalRecords)
var result = linkar_client.LkNew(connectionInfo, filename, strNewId, strNewRecord, newOptions,
                                    LinkarClient.IOFormat.MV, LinkarClient.IOFormat.MV,
                                    customVars, 600)
var strRecordId = null
var strRecord = null
var transaction = 'New'
var output = process_result('New', result)
var lstRecordIds = output['lstRecordIds']
var lstRecord = output['lstRecord']
var strRecordId = lstRecordIds[0]
var strRecord = lstRecord[0]
console.log('strRecordId: ' + strRecordId)
console.log('strRecord: ' + strRecord)

/////////////////
// LkExtract
/////////////////
console.log("-- LkExtract --")
console.log("--------")
result = linkar_client.LkExtract(strRecord, 1, 0, 0)
console.log(result)

/////////////////
// LkReplace
/////////////////
console.log("-- LkReplace --")
console.log("--------")
var replaceVal = "UPDATED CUSTOMER"
result = linkar_client.LkReplace(strRecord, replaceVal, 1, 0, 0)
console.log(result)
strRecord = linkar_client.LkAllocateBuffer(result)

/////////////////
// LkChange
/////////////////
console.log("-- LkChange --")
console.log("--------")
result = linkar_client.LkChange(strRecord, "9", "8", -1, -1)
console.log(result)
strRecord = linkar_client.LkAllocateBuffer(result)

/////////////////
// LkCount
/////////////////
console.log("-- LkCount --")
console.log("--------")
result = linkar_client.LkCount(strRecord, DBMV_Mark_AM[0])
console.log(result)

/////////////////
// LkDCount
/////////////////
console.log("-- LkDCount --")
console.log("--------")
result = linkar_client.LkDCount(strRecord, DBMV_Mark_AM[0])
console.log(result)

/////////////////
// LkUpdate
/////////////////
console.log("-- LkUpdate --")
console.log("--------")
var uop_optimisticLock = false
var uop_readAfter = true
var uop_calculated = false
var uop_conversion = false
var uop_formatSpec = false
var uop_originalRecords = false
var updateOptions = linkar_client.LkCreateUpdateOptions(uop_optimisticLock,
                                                    uop_readAfter, uop_calculated,
                                                    uop_conversion, uop_formatSpec,
                                                    uop_originalRecords)
var originalRecords = ''
result = linkar_client.LkUpdate(connectionInfo, filename, strRecordId, strRecord,
                                    originalRecords, updateOptions,
                                    LinkarClient.IOFormat.MV, LinkarClient.IOFormat.MV,
                                    customVars, 600)
output = process_result('Update', result)
lstRecordIds = output['lstRecordIds']
lstRecord = output['lstRecord']
if(lstRecordIds.length > 0) {
  console.log("--> Data Contents")
  for(i = 0; i < lstRecordIds.length; i++){
      console.log("Id:" + lstRecordIds[i] + " Data:" + lstRecord[i])
  }
}


/////////////////
// LkRead
/////////////////
console.log("-- LkRead --")
console.log("--------")
var rop_calculated = true
var rop_conversion = false
var rop_formatSpec = false
var rop_originalRecords = false
var readOptions = linkar_client.LkCreateReadOptions(rop_calculated,
                                                    rop_conversion, rop_formatSpec,
                                                    rop_originalRecords)
var dictionaries = "ADDR"
var result = linkar_client.LkRead(connectionInfo, filename, strNewId, dictionaries, readOptions,
                                    LinkarClient.IOFormat.MV,
                                    customVars, 600)


output = process_result('Read', result)
lstRecordIds = output['lstRecordIds']
lstRecord = output['lstRecord']
if(lstRecordIds.length > 0) {
  console.log("--> Data Contents")
  for(i = 0; i < lstRecordIds.length; i++){
      console.log("Id:" + lstRecordIds[i] + " Data:" + lstRecord[i])
  }
}

/////////////////
// LkDelete
/////////////////
console.log("-- LkDelete --")
console.log("--------")
var dop_optimisticLock = false
var dop_recoverIdType = linkar_client.LkCreateRecoverRecordIdTypeNone()
var deleteOptions = linkar_client.LkCreateDeleteOptions(dop_optimisticLock, dop_recoverIdType)
originalRecords = ''
result = linkar_client.LkDelete(connectionInfo, filename, strRecordId,
                                    originalRecords, deleteOptions,
                                    LinkarClient.IOFormat.MV,
                                    customVars, 600)

output = process_result('Delete', result)


/////////////////
// LkSubroutine
/////////////////
console.log("-- LkSubRoutine --")
console.log("--------")

var subroutineName = 'SUB.DEMOLINKAR'
var strArgs = linkar_client.LkAddArgumentSubroutine("0", "qwerty")
strArgs = linkar_client.LkAddArgumentSubroutine(strArgs, "")
result = linkar_client.LkSubroutine(connectionInfo, subroutineName, 3, strArgs,
                                    LinkarClient.IOFormat.MV,
                                    customVars, 600)
output = process_result('Subroutine', result)
if(output['lstError'].length == 0) {
  lstConversion = linkar_client.LkGetArgumentsFromLkString(result['lkString'])
  console.log("Arguments result -> " + lstConversion )
}else{
  console.log(output['lstError'])
  console.log("Error while conversion")
}

/////////////////
// LkConversion
/////////////////

console.log("-- LkConversion --")
console.log("--------")
var code = "D2-"
var expression = "13320"
var conversionType = 'O'.charCodeAt(0)

result = linkar_client.LkConversion(connectionInfo, code, expression, conversionType,
                                    LinkarClient.IOFormat.MV,
                                    customVars, 600)
output = process_result('Conversion', result)
if(output['lstError'].length == 0) {
  lstConversion = linkar_client.LkGetConversionFromLkString(result['lkString'])
  console.log("Arguments result -> " + lstConversion )
}else{
  console.log(output['lstError'])
  console.log("Error while conversion")
}

/////////////////
// LkFormat
/////////////////
console.log("-- LkFormat --")
console.log("--------")
var formatSpec = "R%10"
var expression = "HELLO"

result = linkar_client.LkFormat(connectionInfo, formatSpec, expression,
                                      LinkarClient.IOFormat.MV,
                                      customVars, 600)
output = process_result('Format', result)
if(output['lstError'].length == 0) {
  lstConversion = linkar_client.LkGetFormatFromLkString(result['lkString'])
  console.log("Format result -> " + lstConversion )
}else{
  console.log(output['lstError'])
  console.log("Error while conversion")
}


/////////////////
// LkExecute
/////////////////
console.log("-- LkExecute --")
console.log("--------")
var statement = "WHO"
result = linkar_client.LkExecute(connectionInfo, statement,
                                 LinkarClient.IOFormat.MV,
                                 customVars, 600)
output = process_result('Execute', result)
if(output['lstError'].length == 0) {
  lstConversion = linkar_client.LkGetReturningFromLkString(result['lkString'])
  console.log("Execute returning result -> " + lstConversion )
  lstConversion = linkar_client.LkGetCapturingFromLkString(result['lkString'])
  console.log("Execute capturing result -> " + lstConversion )
}else{
  console.log(output['lstError'])
  console.log("Error while conversion")
}

/////////////////
// LkDictionaries
/////////////////
console.log("-- LkDictionaries --")
console.log("--------")
result = linkar_client.LkDictionaries(connectionInfo, filename,
                                    LinkarClient.IOFormat.MV,
                                    customVars, 600)

output = process_result('Dictionaries', result)
if(output['lstError'].length == 0) {
  console.log("Dictionaries is OK!")
  lstDictionaryIds = linkar_client.LkGetDictionaryIdsFromLkString(result['lkString'])
  lstDictionary = linkar_client.LkGetDictionariesFromLkString(result['lkString'])
  if(lstDictionaryIds.length > 0) {
    console.log("--> Data Contents")
    for(i = 0; i < lstDictionaryIds.length; i++){
        console.log("Id:" + lstDictionaryIds[i] + " Data:" + lstDictionary[i])
    }
  }

}else{
  console.log(output['lstError'])
  console.log("Error while conversion")
}

/////////////////
// LkSelect
/////////////////
console.log("-- LkSelect --")
console.log("--------")
var sop_onlyRecordId = false
var sop_pagination = false
var sop_regPage = 0
var sop_numPage = 0
var sop_calculated = true
var sop_conversion = false
var sop_formatSpec = false
var sop_originalRecords = false
var selectOptions = linkar_client.LkCreateSelectOptions(sop_onlyRecordId, sop_pagination, sop_regPage,
                                                      sop_numPage, sop_calculated, sop_conversion,
                                                      sop_formatSpec, sop_originalRecords)

var selectClause = ""
var sortClause = "BY CODE"
var dictClause = ""
var preSelectClause = ""
result = linkar_client.LkSelect(connectionInfo, filename, selectClause, sortClause,
                                dictClause, preSelectClause, selectOptions,
                                LinkarClient.IOFormat.MV,
                                customVars, 600)
output = process_result('Select', result)
if(output['lstError'].length == 0) {
  console.log("Select is OK!")

  // lstRecordIds
  lstRecordIds = output['lstRecordIds']
  lstRecord = output['lstRecord']
  if (lstRecordIds.length > 0 ){
    console.log("--> Data Contents")
    for(i = 0; i < lstRecordIds.length; i++)
        console.log("Id:" + lstRecordIds[i] + " Data:" + lstRecord[i])
  }


}else{
  console.log(output['lstError'])
  console.log("Error while conversion")
}

/////////////////
// LkSchemas
/////////////////
console.log("-- LkSchemas --")
console.log("--------")
var schop_rowHeadersType = LinkarClient.RowHeadersType.MAINLABEL
var schop_rowProperties = false
var schop_onlyVisibles = false
var schop_pagination = false
var schop_regPage = 0
var schop_numPage = 0
var lkSchemasOptions = linkar_client.LkCreateSchOptionsTypeLKSCHEMAS(schop_rowHeadersType,
																	 schop_rowProperties,
																	 schop_onlyVisibles,
																	 schop_pagination,
																	 schop_regPage,
																	 schop_numPage)

result = linkar_client.LkSchemas(connectionInfo, lkSchemasOptions,
                                LinkarClient.IOFormatSch.MV,
                                customVars, 600)
output = process_result('Schemas', result)
if(output['lstError'].length == 0) {
  console.log("Schemas is OK!")

  // lstRecordIds
  lstRecordIds = output['lstRecordIds']
  lstRecord = output['lstRecord']
  if (lstRecordIds.length > 0 ){
    console.log("--> Data Contents")
    for(i = 0; i < lstRecordIds.length; i++)
        console.log("Id:" + lstRecordIds[i] + " Data:" + lstRecord[i])
  }


}else{
  console.log(output['lstError'])
  console.log("Error while conversion")
}

/////////////////
// LkProperties
/////////////////
console.log("-- LkProperties --")
console.log("--------")
var propop_rowHeadersType = LinkarClient.RowHeadersType.MAINLABEL
var propop_rowProperties = false
var propop_onlyVisibles = false
var propop_usePropertyNames = false
var propop_pagination = false
var propop_regPage = 0
var propop_numPage = 0
var lkPropertiesOptions = linkar_client.LkCreatePropOptionsTypeLKSCHEMAS(propop_rowHeadersType, propop_rowProperties, propop_onlyVisibles, propop_usePropertyNames, propop_pagination, propop_regPage, propop_numPage)

filename = "LK.ORDERS"
result = linkar_client.LkProperties(connectionInfo, filename, lkPropertiesOptions,
                                LinkarClient.IOFormatSch.MV,
                                customVars, 600)
output = process_result('Properties', result)
if(output['lstError'].length == 0) {
  console.log("Properties is OK!")

  // lstRecordIds
  lstRecordIds = output['lstRecordIds']
  lstRecord = output['lstRecord']
  if (lstRecordIds.length > 0 ){
    console.log("--> Data Contents")
    for(i = 0; i < lstRecordIds.length; i++) {
        console.log("Id:" + lstRecordIds[i] + " Data:" + lstRecord[i])
	}
  }


}else{
  console.log(output['lstError'])
  console.log("Error while conversion")
}

/////////////////
// LkGetTable
/////////////////
console.log("-- LkGetTable --")
console.log("--------")
var gtop_rowHeadersType = LinkarClient.RowHeadersType.SHORTLABEL
var gtop_rowProperties = false
var gtop_onlyVisibles = false
var gtop_usePropertyNames = false
var gtop_repeatValues = false
var gtop_applyConversion = true
var gtop_applyFormat = true
var gtop_calculated = true
var gtop_pagination = true
var gtop_regPage = 50
var gtop_numPage = 1
var tableOptions = linkar_client.LkCreateTableOptionsTypeLKSCHEMAS(gtop_rowHeadersType, gtop_rowProperties, gtop_onlyVisibles, gtop_usePropertyNames,
                                                        gtop_repeatValues, gtop_applyConversion, gtop_applyFormat, gtop_calculated,
                                                        gtop_pagination, gtop_regPage, gtop_numPage)


filename = "LK.ORDERS"
var selectClause = ""
var sortClause = "BY CODE"
var dictClause = ""
result = linkar_client.LkGetTable(connectionInfo, filename, selectClause, sortClause,
                                dictClause, tableOptions,
                                customVars, 600)
  hasError = result['hasError']
  output = result['lkString']
  if(hasError){
      console.log("Error while LkGetTable")
      console.log(output.readCString())
      process.exit(0)
  }else{
	  var outputStr = output.toString('utf-8')
	  //var rows = outputStr.split(DBMV_Mark_AM_utf8)
	  var rows = outputStr.split("\v")
	  for(i = 0; i < rows.length; i++)
		  console.log(rows[i])
  }

  
/////////////////
// LkResetCommonBlocks
/////////////////
console.log("-- LkResetCommonBlocks --")
console.log("--------")
result = linkar_client.LkResetCommonBlocks(connectionInfo, LinkarClient.IOFormat.MV, customVars, 600)
output = process_result('ResetCommonBlocks', result)

if(output['lstError'].length == 0) {
  returning = linkar_client.LkGetReturningFromLkString(result['lkString'])
  console.log("Execute returning result -> " + returning )
  capturing = linkar_client.LkGetCapturingFromLkString(result['lkString'])
  console.log("Execute capturing result -> " + capturing )
}else{
  console.log(output['lstError'])
  console.log("Error while ResetCommonBlocks")
}


/////////////////
// LkLogout
/////////////////
console.log("-- LkLogout --")
console.log("--------")
result = linkar_client.LkLogout(connectionInfo, "", 600)
hasError = result['hasError']
if(hasError){
  console.log("Error Logout")
}
console.log("Demo OK!")
