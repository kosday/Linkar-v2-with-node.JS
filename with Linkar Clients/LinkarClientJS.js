var ffi = require('ffi');
var ref = require('ref');
var ArrayType = require('ref-array');

var StringArray = ArrayType('char*');
//var StringArray = ArrayType('string');
var CharArray = ArrayType('char')

const CredentialOptions = {
  HOST: 0,
  PORT: 1,
  USERNAME: 2,
  PASSWORD: 3,
  ENTRYPOINT: 4,
  LANGUAGE: 5,
  FREETEXT: 6
}

const ConnectionInfo = {
  CREDENTIAL_OPTIONS: 0,
  SESSION_ID: 1
}

const IOFormat = {
  MV: 1,
  XML: 2,
  JSON: 3
}

const IOFormatSch = {
  MV: 1,
  XML: 2,
  JSON: 3,
  TABLE: 4
}

const IOFormatCru = {
  MV: 1,
  XML: 2,
  JSON: 3,
  TABLE: 4,
  XML_DICT: 5,
  XML_SCH: 6,
  JSON_DICT: 7,
  JSON_SCH: 8
}

const RowHeadersType = {
  MAINLABEL: 1,
  SHORTLABEL: 2,
  NONE: 3
}

class LinkarClient {
   constructor() {
	   // Here you must put the corrects path names to the Linkar C library
       var library = (process.platform === 'linux'?'../Clients/Clib/x64/libLinkarClientC':'../Clients/Clib/x64/LinkarClientC');

       this.lib_linkar = ffi.Library(library, {

         // --------------------------
         // Helper functions for management complex "string object"
         // --------------------------
         'LkCreateCredentialOptions': ['char*', ['string', 'string', 'int', 'string', 'string', 'string', 'string']],
         'LkGetDataFromCredentialOptions': ['char*', ['string', 'int']],
         'LkGetDataFromConnectionInfo': ['char*', ['string', 'int']],
         'LkCreateReadOptions': ['char*', ['bool', 'bool', 'bool', 'bool']],
         'LkCreateUpdateOptions': ['char*', ['bool', 'bool', 'bool', 'bool', 'bool', 'bool']],
         'LkCreateNewRecordIdTypeNone': ['char*', []],
         'LkCreateNewRecordIdTypeLinkar': ['char*', ['string', 'string', 'string']],
         'LkCreateNewRecordIdTypeCustom': ['char*', []],
         'LkCreateNewRecordIdTypeRandom': ['char*', ['bool', 'long']],
         'LkCreateNewOptions': ['char*', ['char*', 'bool', 'bool', 'bool', 'bool', 'bool']],
         'LkCreateRecoverRecordIdTypeNone': ['char*', []],
         'LkCreateRecoverRecordIdTypeLinkar': ['char*', ['string', 'string']],
         'LkCreateRecoverRecordIdTypeCustom': ['char*', []],
         'LkCreateDeleteOptions': ['char*', ['bool', 'string']],
         'LkCreateSelectOptions': ['char*', ['bool', 'bool', 'long', 'long', 'bool', 'bool', 'bool', 'bool']],	 
		 'LkAddArgumentSubroutine': ['char*', ['string', 'string']],

         'LkCreateSchOptionsTypeLKSCHEMAS': ['char*', ['int', 'bool', 'bool', 'bool', 'long', 'long']],	 		 
		 'LkCreateSchOptionsTypeSQLMODE': ['char*', ['bool', 'bool', 'long', 'long']],	 		 		 
		 'LkCreateSchOptionsTypeDICTIONARIES': ['char*', ['int', 'bool', 'long', 'long']],	 		 
         'LkCreatePropOptionsTypeLKSCHEMAS': ['char*', ['int', 'bool', 'bool', 'bool', 'bool', 'long', 'long']],
		 'LkCreatePropOptionsTypeSQLMODE': ['char*', ['bool', 'bool', 'long', 'long']],
		 'LkCreatePropOptionsTypeDICTIONARIES': ['char*', ['int', 'bool', 'long', 'long']],	 
         'LkCreateTableOptionsTypeLKSCHEMAS': ['char*', ['int', 'bool', 'bool', 'bool', 'bool', 'bool', 'bool', 'bool', 'bool', 'long', 'long']],		 
		 'LkCreateTableOptionsTypeSQLMODE': ['char*', ['bool', 'bool', 'bool', 'bool', 'bool', 'long', 'long']],
		 'LkCreateTableOptionsTypeDICTIONARIES': ['char*', ['int', 'bool', 'bool', 'bool', 'bool', 'bool', 'long', 'long']],
		 'LkCreateTableOptionsTypeNONE': ['char*', ['int', 'bool', 'bool', 'long', 'long']],
		 
		 
         // --------------------------
         // Persistent Function
         // --------------------------
         'LkLogin': ['char*', ['string', ref.refType('bool'), 'string', 'int']],
         'LkLogout': ['char*', ['string', ref.refType('bool'), 'string', 'int']],
         'LkRead': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'int', 'string', 'long']],
         'LkUpdate': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'string', 'int', 'int', 'string', 'long']],
         'LkNew': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'int', 'int', 'string', 'long']],
         'LkDelete': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'int', 'string', 'long']],
         'LkSelect': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'string', 'string', 'int', 'string', 'long']],
         'LkSubroutine': ['char*', ['string', ref.refType('bool'), 'string', 'int', 'string', 'int', 'string', 'long']],
         'LkConversion': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'char', 'int', 'string', 'long']],
         'LkFormat': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'int', 'string', 'long']],
         'LkDictionaries': ['char*', ['string', ref.refType('bool'), 'string', 'int', 'string', 'long']],
         'LkExecute': ['char*', ['string', ref.refType('bool'), 'string', 'int', 'string', 'long']],
         'LkSendCommand': ['char*', ['string', ref.refType('bool'), 'int', 'string', 'long']],
         'LkGetVersion': ['char*', ['string', ref.refType('bool'), 'int', 'string', 'long']],
  		 'LkSchemas': ['char*', ['string', ref.refType('bool'), 'string', 'int', 'string', 'long']],		 
		 'LkProperties': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'int', 'string', 'long']],		 
		 'LkGetTable': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'string', 'string', 'long']],		 
		 'LkResetCommonBlocks': ['char*', ['string', ref.refType('bool'), 'int', 'string', 'long']],		 

		
		 
         // --------------------------
         // Direct Function
         // --------------------------
         'LkReadD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'int', 'string', 'long']],
         'LkUpdateD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'string', 'int', 'int', 'string', 'long']],
         'LkNewD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'int', 'int', 'string', 'long']],
         'LkDeleteD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'int', 'string', 'long']],
         'LkSelectD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'string', 'string', 'int', 'string', 'long']],
         'LkSubroutineD': ['char*', ['string', ref.refType('bool'), 'string', 'int', 'string', 'int', 'string', 'long']],
         'LkConversionD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'char', 'int', 'string', 'long']],
         'LkFormatD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'int', 'string', 'long']],
         'LkDictionariesD': ['char*', ['string', ref.refType('bool'), 'string', 'int', 'string', 'long']],
         'LkExecuteD': ['char*', ['string', ref.refType('bool'), 'string', 'int', 'string', 'long']],
         'LkSendCommandD': ['char*', ['string', ref.refType('bool'), 'int', 'string', 'long']],
         'LkGetVersionD': ['char*', ['string', ref.refType('bool'), 'int', 'string', 'long']],
		 'LkSchemasD': ['char*', ['string', ref.refType('bool'), 'string', 'int', 'string', 'long']],
		 'LkPropertiesD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'int', 'string', 'long']],
		 'LkGetTableD': ['char*', ['string', ref.refType('bool'), 'string', 'string', 'string', 'string', 'string', 'string', 'long']],
		 'LkResetCommonBlocksD': ['char*', ['string', ref.refType('bool'), 'int', 'string', 'long']],

		 
         // --------------------------
         //   Helper Data Functions
         // --------------------------
         'LkGetErrorsFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetTotalRecordsFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetRecordIdsFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetRecordsFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetRecordsCalculatedFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetRecordsDictionariesFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetRecordsIdDictsFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetRecordsCalculatedDictionariesFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetOriginalRecordsFromLkString': [StringArray, ['char*', ref.refType('long')] ],
         'LkGetDictionaryIdsFromLkString': [StringArray, ['char*', ref.refType('long')]],
         'LkGetDictionariesFromLkString': [StringArray, ['char*', ref.refType('long')]],
         'LkGetCapturingFromLkString': ['char*', ['char*']],
         'LkGetConversionFromLkString': ['char*', ['char*']],
         'LkGetFormatFromLkString': ['char*', ['char*']],
         'LkGetReturningFromLkString': ['char*', ['char*']],
         'LkGetArgumentsFromLkString': ['char*', ['char*']],

         // --------------------------
         // Helper MV Functions
         // --------------------------
         'LkCount': ['long', ['string', 'int']],
         'LkDCount': ['long', ['string', 'int']],
         'LkExtract': ['char*', ['char*', 'long', 'long', 'long']],
         'LkReplace': ['char*', ['char*', 'char*', 'long', 'long', 'long']],
         'LkChange': ['char*', ['char*', 'char*', 'char*', 'long', 'long']],
         'LkFreeMemory': ['void', ['char*']],
       });
   }

   LkAllocateBuffer(input_buffer){
     var output_buffer = Buffer.alloc(input_buffer.length+1, 0)
     input_buffer.copy(output_buffer, 0);
     return output_buffer
   }

   LkCloneAndFree(ret_cxx_value){
     var buff = ref.reinterpretUntilZeros(ret_cxx_value, 1)
     var output_buffer = this.LkAllocateBuffer(buff)
     return output_buffer
   }

   LkCloneArrayAndFree(ret_cxx_value){
     // Tranform into buffer
     var ret_array = []
     for( var i = 0; i < ret_cxx_value.length; i ++){
       var buff = ref.reinterpretUntilZeros(ret_cxx_value[i], 1)
       var output_buffer = this.LkAllocateBuffer(buff)
       ret_array.push(output_buffer)
     }

     // Freeing memory
     for( var i = 0; i < ret_cxx_value.length; i ++){
       this.LkFreeMemory(ret_cxx_value[i])
     }
     this.LkFreeMemory( ret_cxx_value.buffer )

     return ret_array
   }


   // --------------------------
   // Helper functions for management complex "string object"
   // --------------------------

   LkCreateCredentialOptions(host, entrypoint, port, username, password, language, freetext){
      var ret_cxx_value = this.lib_linkar.LkCreateCredentialOptions(host, entrypoint, port, username, password, language, freetext)
      return this.LkCloneAndFree(ret_cxx_value)
   }

   LkGetDataFromCredentialOptions(credentialOptions, index){
     var ret_cxx_value = this.lib_linkar.LkGetDataFromCredentialOptions(credentialOptions, index)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkGetDataFromConnectionInfo(credentialOptions, index){
     var ret_cxx_value = this.lib_linkar.LkGetDataFromConnectionInfo(credentialOptions, index)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkCreateReadOptions(calculated, conversion, formatSpec, originalRecords){
      var ret_cxx_value = this.lib_linkar.LkCreateReadOptions(calculated, conversion, formatSpec,
                                                        originalRecords)
      return this.LkCloneAndFree(ret_cxx_value)
    }

   LkCreateUpdateOptions(optimisticLock, readAfter, calculated,
                                   conversion, formatSpec, originalRecords){
      var ret_cxx_value = this.lib_linkar.LkCreateUpdateOptions(optimisticLock, readAfter, calculated,
                                                          conversion, formatSpec, originalRecords)
      return this.LkCloneAndFree(ret_cxx_value)
   }

   LkCreateNewRecordIdTypeNone() {
     var ret_cxx_value = this.lib_linkar.LkCreateNewRecordIdTypeNone()
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkCreateNewRecordIdTypeLinkar(prefix, separator, formatSpec){
     var ret_cxx_value = this.lib_linkar.LkCreateNewRecordIdTypeLinkar(prefix, separator, formatSpec)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkCreateNewRecordIdTypeCustom(){
     var ret_cxx_value = this.lib_linkar.LkCreateNewRecordIdTypeCustom()
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkCreateNewRecordIdTypeRandom(numeric, length){
     var ret_cxx_value = this.lib_linkar.LkCreateNewRecordIdTypeRandom(numeric, length)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkCreateNewOptions(newItemIdType, readAfter, calculated, conversion,
                           formatSpec, originalRecords){
      var ret_cxx_value = this.lib_linkar.LkCreateNewOptions(newItemIdType, readAfter, calculated, conversion,
                                                        formatSpec, originalRecords)
      return this.LkCloneAndFree(ret_cxx_value)
    }

    LkCreateRecoverRecordIdTypeNone(){
       var ret_cxx_value = this.lib_linkar.LkCreateRecoverRecordIdTypeNone(prefix, separator)
       return this.LkCloneAndFree(ret_cxx_value)
    }

    LkCreateRecoverRecordIdTypeLinkar(prefix, separator){
        var ret_cxx_value = this.lib_linkar.LkCreateRecoverRecordIdTypeLinkar(prefix, separator)
        return this.LkCloneAndFree(ret_cxx_value)
    }

    LkCreateRecoverRecordIdTypeCustom(prefix, separator){
        var ret_cxx_value = this.lib_linkar.LkCreateRecoverRecordIdTypeCustom(prefix, separator)
        return this.LkCloneAndFree(ret_cxx_value)
    }

    LkCreateRecoverRecordIdTypeNone(){
      var ret_cxx_value = this.lib_linkar.LkCreateRecoverRecordIdTypeNone()
      return this.LkCloneAndFree(ret_cxx_value)
    }

    LkCreateDeleteOptions(optimisticLock, recoverIdType){
      var ret_cxx_value = this.lib_linkar.LkCreateDeleteOptions(optimisticLock, recoverIdType)
      return this.LkCloneAndFree(ret_cxx_value)
    }

    LkCreateSelectOptions(onlyRecordId, pagination, regPage, numPage,
                                 calculated, conversion, formatSpec, originalRecords){
      var ret_cxx_value = this.lib_linkar.LkCreateSelectOptions(onlyRecordId, pagination, regPage, numPage,
                                                          calculated, conversion, formatSpec, originalRecords)
      return this.LkCloneAndFree(ret_cxx_value)
    }

    //LkCreateSelectOptions(onlyRecordId, pagination, regPage, numPage,
    //                            calculated, conversion, formatSpec, originalRecords){
    //  var ret_cxx_value = this.lib_linkar.LkCreateSelectOptions(onlyRecordId, pagination, regPage, numPage,
    //                              calculated, conversion, formatSpec, originalRecords)
    //  return this.LkCloneAndFree(ret_cxx_value)
    //}


    LkAddArgumentSubroutine( _arguments, newArgument) {
      var ret_cxx_value = ''
      if( typeof _arguments === "string"){
        ret_cxx_value = this.lib_linkar.LkAddArgumentSubroutine(this.LkAllocateBuffer(Buffer.from(_arguments, 'latin1')),
                                                              this.LkAllocateBuffer(Buffer.from(newArgument, 'latin1')))
      }else{
        ret_cxx_value = this.lib_linkar.LkAddArgumentSubroutine(_arguments,
                                                              this.LkAllocateBuffer(Buffer.from(newArgument, 'latin1')))
      }
      return this.LkCloneAndFree(ret_cxx_value)
    }
	
	LkCreateSchOptionsTypeLKSCHEMAS(rowHeaders, rowProperties, onlyVisibles, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreateSchOptionsTypeLKSCHEMAS(rowHeaders, rowProperties, onlyVisibles, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }
	
	LkCreateSchOptionsTypeSQLMODE(onlyVisibles, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreateSchOptionsTypeSQLMODE(onlyVisibles, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }

	LkCreateSchOptionsTypeDICTIONARIES(rowHeaders, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreateSchOptionsTypeDICTIONARIES(rowHeaders, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }	
		 
	LkCreatePropOptionsTypeLKSCHEMAS(rowHeaders, rowProperties, onlyVisibles, usePropertyNames, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreatePropOptionsTypeLKSCHEMAS(rowHeaders, rowProperties, onlyVisibles, usePropertyNames, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }

	LkCreatePropOptionsTypeSQLMODE(onlyVisibles, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreatePropOptionsTypeSQLMODE(onlyVisibles, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }	

	LkCreatePropOptionsTypeDICTIONARIES(rowHeaders, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreatePropOptionsTypeDICTIONARIES(rowHeaders, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }
	
	LkCreateTableOptionsTypeLKSCHEMAS(rowHeaders, rowProperties, onlyVisibles, usePropertyNames, repeatValues, applyConversion, applyFormat, calculated, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreateTableOptionsTypeLKSCHEMAS(rowHeaders, rowProperties, onlyVisibles, usePropertyNames, repeatValues, applyConversion, applyFormat, calculated, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }

	LkCreateTableOptionsTypeSQLMODE(onlyVisibles, repeatValues, applyConversion, applyFormat, calculated, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreateTableOptionsTypeSQLMODE(onlyVisibles, repeatValues, applyConversion, applyFormat, calculated, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }	

	LkCreateTableOptionsTypeDICTIONARIES(rowHeaders, repeatValues, applyConversion, applyFormat, calculated, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreateTableOptionsTypeDICTIONARIES(rowHeaders, repeatValues, applyConversion, applyFormat, calculated, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }	

	LkCreateTableOptionsTypeNONE(rowHeaders, repeatValues, pagination, regPage, numPage){
      var ret_cxx_value = this.lib_linkar.LkCreateTableOptionsTypeNONE(rowHeaders, repeatValues, pagination, regPage, numPage)
      return this.LkCloneAndFree(ret_cxx_value)
    }		
         
		 

		 
	
   // --------------------------
   // Persistent Function
   // --------------------------

   LkLogin(crdOpt, customVars, receiveTimeout){
     var hasError = ref.alloc('bool', true)
     var ret_cxx_value = this.lib_linkar.LkLogin(crdOpt, hasError, customVars, receiveTimeout)
     return {'lkString': ret_cxx_value, 'hasError': hasError.deref() }
   }

   LkLogout(crdOpt, customVars, receiveTimeout){
     var hasError = ref.alloc('bool', true)
     var ret_cxx_value = this.lib_linkar.LkLogout(crdOpt, hasError, customVars, receiveTimeout)
     return {'lkString': ret_cxx_value, 'hasError': hasError.deref() }
   }

   LkRead(connectionInfo, filename, recordsIds, dictClause,
              readOptions, outputStringType, customVars, receiveTimeout){
      var hasError = ref.alloc('bool', true)
      var ret_cxx_value = this.lib_linkar.LkRead(connectionInfo, hasError, filename, recordsIds, dictClause,
                                                    readOptions, outputStringType, customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
   }

   LkUpdate(connectionInfo, filename, recordsIds, records, originalRecords,
                 updateOptions, inputDataFormat, outputStringType,
                 customVars, receiveTimeout){
      var hasError = ref.alloc('bool', true)
      var ret_cxx_value = this.lib_linkar.LkUpdate(connectionInfo, hasError, filename, recordsIds, records, originalRecords,
                                                      updateOptions, inputDataFormat, outputStringType,
                                                      customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
   }

   LkNew(connectionInfo, filename, recordsIds, records, newOptions,
              inputDataFormat, outputStringType, customVars, receiveTimeout){
     var hasError = ref.alloc('bool', true)
     var ret_cxx_value = this.lib_linkar.LkNew(connectionInfo, hasError, filename, recordsIds, records, newOptions,
                                                    inputDataFormat, outputStringType, customVars, receiveTimeout)
     var ret_value = this.LkCloneAndFree(ret_cxx_value)
     return {'lkString': ret_value, 'hasError': hasError.deref() }
   }

   LkDelete(connectionInfo, filename, recordsIds, originalRecords, deleteOptions,
             outputStringType, customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkDelete(connectionInfo, hasError, filename,
                                                      recordsIds, originalRecords, deleteOptions,
                                                      outputStringType, customVars, receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkSelect(connectionInfo, filename, selectClause, sortClause,
                 dictClause, preSelectClause, selectOptions, outputStringType,
                 customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkSelect(connectionInfo, hasError, filename, selectClause, sortClause,
                                                      dictClause, preSelectClause, selectOptions, outputStringType,
                                                      customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkSubroutine(connectionInfo, name, numArguments, _arguments,
                 outputStringType, customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkSubroutine(connectionInfo, hasError, name, numArguments, _arguments,
                                                          outputStringType, customVars, receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }


    LkConversion(connectionInfo, code, expression, conversionOptions,
                     outputStringType, customVars, receiveTimeout){

       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkConversion(connectionInfo, hasError, code, expression,
                                                          conversionOptions, outputStringType, customVars, receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkFormat(connectionInfo, formatSpec, expression,
                   outputStringType, customVars, receiveTimeout){

       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkFormat(connectionInfo, hasError, formatSpec, expression,
                                                      outputStringType, customVars, receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkDictionaries(connectionInfo, filename,
                       outputStringType, customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkDictionaries(connectionInfo, hasError, filename,
                                                            outputStringType, customVars, receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkExecute(connectionInfo, statement, outputStringType, customVars, receiveTimeout){

        var hasError = ref.alloc('bool', true)
        var ret_cxx_value = this.lib_linkar.LkExecute(connectionInfo, hasError, statement, outputStringType,
                                                      customVars, receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }
    	
    LkSendCommand(connectionInfo, data, outputStringType, receiveTimeout){

        var hasError = ref.alloc('bool', true)
        var ret_cxx_value = this.lib_linkar.LkSendCommand(connectionInfo, hasError, data, outputStringType,
                                                      receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkGetVersion(connectionInfo, outputStringType, receiveTimeout){

        var hasError = ref.alloc('bool', true)
        var ret_cxx_value = this.lib_linkar.LkGetVersion(connectionInfo, hasError, outputStringType,
                                                      receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkSchemas(connectionInfo, lkSchemasOptions, outputStringType,
                 customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkSchemas(connectionInfo, hasError, lkSchemasOptions, outputStringType,
				customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkProperties(connectionInfo, filename, lkPropertiesOptions, outputStringType,
                 customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkProperties(connectionInfo, hasError, filename, lkPropertiesOptions, outputStringType,
				customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }	

    LkGetTable(connectionInfo, filename, selectClause, sortClause, dictClause, tableOptions, 
                 customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkGetTable(connectionInfo, hasError, filename, selectClause, sortClause, dictClause, tableOptions,
				customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }		

    LkResetCommonBlocks(connectionInfo, outputStringType, customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkResetCommonBlocks(connectionInfo, hasError, outputStringType, customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }
	
   // --------------------------
   // Direct Functions
   // --------------------------

   LkReadD(credentialoptions, filename, recordsIds, dictClause,
              readOptions, outputStringType, customVars, receiveTimeout){
      var hasError = ref.alloc('bool', true)
      var ret_cxx_value = this.lib_linkar.LkReadD(credentialoptions, hasError, filename, recordsIds, dictClause,
                                                    readOptions, outputStringType, customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
   }

   LkUpdateD(credentialoptions, filename, recordsIds, records, originalRecords,
                 updateOptions, inputDataFormat, outputStringType,
                 customVars, receiveTimeout){
      var hasError = ref.alloc('bool', true)
      var ret_cxx_value = this.lib_linkar.LkUpdateD(credentialoptions, hasError, filename, recordsIds, records, originalRecords,
                                                      updateOptions, inputDataFormat, outputStringType,
                                                      customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
   }

   LkNewD(credentialoptions, filename, recordsIds, records, newOptions,
              inputDataFormat, outputStringType, customVars, receiveTimeout){
     var hasError = ref.alloc('bool', true)
     var ret_cxx_value = this.lib_linkar.LkNewD(credentialoptions, hasError, filename, recordsIds, records, newOptions,
                                                    inputDataFormat, outputStringType, customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
   }

   LkDeleteD(credentialoptions, filename, recordsIds, originalRecords, deleteOptions,
             outputStringType, customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkDeleteD(credentialoptions, hasError, filename,
                                                      recordsIds, originalRecords, deleteOptions,
                                                      outputStringType, customVars, receiveTimeout)
       var ret_value = this.LkCloneAndFree(ret_cxx_value)
       return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkSelectD(credentialoptions, filename, selectClause, sortClause,
                 dictClause, preSelectClause, selectOptions, outputStringType,
                 customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkSelectD(credentialoptions, hasError, filename, selectClause, sortClause,
                                                      dictClause, preSelectClause, selectOptions, outputStringType,
                                                      customVars, receiveTimeout)
       var ret_value = this.LkCloneAndFree(ret_cxx_value)
       return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkSubroutineD(credentialoptions, name, numArguments, _arguments,
                 outputStringType, customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkSubroutineD(credentialoptions, hasError, name, numArguments, _arguments,
                                                          outputStringType, customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }


    LkConversionD(credentialoptions, code, expression, conversionOptions,
                     outputStringType, customVars, receiveTimeout){

       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkConversionD(credentialoptions, hasError, code, expression,
                                                          conversionOptions, outputStringType, customVars, receiveTimeout)
       var ret_value = this.LkCloneAndFree(ret_cxx_value)
       return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkFormatD(credentialoptions, formatSpec, expression,
                   outputStringType, customVars, receiveTimeout){

       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkFormatD(credentialoptions, hasError, formatSpec, expression,
                                                      outputStringType, customVars, receiveTimeout)
       var ret_value = this.LkCloneAndFree(ret_cxx_value)
       return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkDictionariesD(credentialoptions, filename,
                       outputStringType, customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkDictionariesD(credentialoptions, hasError, filename,
                                                            outputStringType, customVars, receiveTimeout)
       var ret_value = this.LkCloneAndFree(ret_cxx_value)
       return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkExecuteD(credentialoptions, statement, outputStringType,
                    customVars, receiveTimeout){

        var hasError = ref.alloc('bool', true)
        var ret_cxx_value = this.lib_linkar.LkExecuteD(credentialoptions, hasError, statement, outputStringType,
                                                      customVars, receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

	
    LkSendCommandD(credentialoptions, data, outputStringType, receiveTimeout){

        var hasError = ref.alloc('bool', true)
        var ret_cxx_value = this.lib_linkar.LkSendCommandD(credentialoptions, hasError, data,
                                            outputStringType, receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkGetVersionD(credentialoptions, outputStringType, receiveTimeout){

        var hasError = ref.alloc('bool', true)
        var ret_cxx_value = this.lib_linkar.LkGetVersionD(credentialoptions, hasError, outputStringType,
                                                      receiveTimeout)
        var ret_value = this.LkCloneAndFree(ret_cxx_value)
        return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkSchemasD(credentialoptions, lkSchemasOptions, outputStringType,
                 customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkSchemasD(credentialoptions, hasError, lkSchemasOptions, outputStringType,
				customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }

    LkPropertiesD(credentialoptions, filename, lkPropertiesOptions, outputStringType,
                 customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkPropertiesD(credentialoptions, hasError, filename, lkPropertiesOptions, outputStringType,
				customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }	

    LkGetTableD(credentialoptions, filename, selectClause, sortClause, dictClause, tableOptions, 
                 customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkGetTableD(credentialoptions, hasError, filename, selectClause, sortClause, dictClause, tableOptions,
				customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }		

    LkResetCommonBlocksD(credentialoptions, outputStringType, customVars, receiveTimeout){
       var hasError = ref.alloc('bool', true)
       var ret_cxx_value = this.lib_linkar.LkResetCommonBlocksD(credentialoptions, hasError, outputStringType, customVars, receiveTimeout)
      var ret_value = this.LkCloneAndFree(ret_cxx_value)
      return {'lkString': ret_value, 'hasError': hasError.deref() }
    }			
	
   // --------------------------
   //   Helper Data Functions
   // --------------------------

   LkGetErrorsFromLkString(lkString){
     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetErrorsFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     var ret_array = this.LkCloneArrayAndFree(ret_cxx_value)
     return ret_array;
   }

   LkGetRecordIdsFromLkString(lkString){
     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetRecordIdsFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetRecordsFromLkString(lkString){

     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetRecordsFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetRecordsCalculatedFromLkString(lkString){

     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetRecordsCalculatedFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetRecordsDictionariesFromLkString(lkString){

     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetRecordsDictionariesFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetRecordsIdDictsFromLkString(lkString){

     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetRecordsIdDictsFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetRecordsCalculatedDictionariesFromLkString(lkString){

     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetRecordsCalculatedDictionariesFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetOriginalRecordsFromLkString(lkString){
     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetOriginalRecordsFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetDictionaryIdsFromLkString(lkString){
     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetDictionaryIdsFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetDictionariesFromLkString(lkString){
     var lkStringMatrixLength = ref.alloc('long', 0)
     var ret_cxx_value = this.lib_linkar.LkGetDictionariesFromLkString(lkString, lkStringMatrixLength)
     ret_cxx_value.length = lkStringMatrixLength.deref()
     return this.LkCloneArrayAndFree(ret_cxx_value)
   }

   LkGetCapturingFromLkString(lkString){
     var ret_cxx_value = this.lib_linkar.LkGetCapturingFromLkString(lkString)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkGetConversionFromLkString(lkString){
     var ret_cxx_value = this.lib_linkar.LkGetConversionFromLkString(lkString)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkGetFormatFromLkString(lkString){
     // return this.lib_linkar.LkGetFormatFromLkString(lkString)
     var ret_cxx_value = this.lib_linkar.LkGetFormatFromLkString(lkString)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkGetReturningFromLkString(lkString){
     var ret_cxx_value = this.lib_linkar.LkGetReturningFromLkString(lkString)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   LkGetArgumentsFromLkString(lkString){
     var ret_cxx_value = this.lib_linkar.LkGetArgumentsFromLkString(lkString)
     return this.LkCloneAndFree(ret_cxx_value)
   }

   // --------------------------
   // Helper MV Functions
   // --------------------------

   LkCount(str, delimiter){
     return this.lib_linkar.LkCount(str, delimiter)
   }

   LkDCount(str, delimiter){
     return this.lib_linkar.LkDCount(str, delimiter)
   }

   LkExtract(str, field, value, subvalue){
     var ret_cxx_value = this.lib_linkar.LkExtract(str, field, value, subvalue)
     var return_val = ref.reinterpretUntilZeros(ret_cxx_value, 1)
     return return_val
   }

   LkReplace(str, newVal, field, value, subvalue){

     var ret_cxx_value = this.lib_linkar.LkReplace(str, this.LkAllocateBuffer(Buffer.from(newVal, 'latin1')),
                                             field, value, subvalue)
     var return_val = ref.reinterpretUntilZeros(ret_cxx_value, 1)
     return return_val
   }

   LkChange(str, strOld, strNew, occurrence, start){
     var ret_cxx_value = this.lib_linkar.LkChange(str,
                                            this.LkAllocateBuffer(Buffer.from(strOld)),
                                            this.LkAllocateBuffer(Buffer.from(strNew)),
                                            occurrence, start)
     var return_val = ref.reinterpretUntilZeros(ret_cxx_value, 1)
     return return_val
   }

   LkFreeMemory(lkString){
     this.lib_linkar.LkFreeMemory(lkString)
   }

}

module.exports = { CredentialOptions, ConnectionInfo, IOFormat, IOFormatSch, RowHeadersType, LinkarClient }
