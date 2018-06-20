// Copyright © 2010. Adobe Systems Incorporated. All Rights Reserved.
//
//-------------------------- Flash-16.0.jsx Version 1.0.0 -----------------------
//
// ADOBE SYSTEMS INCORPORATED
// Copyright 2010 Adobe Systems Incorporated 
// All Rights Reserved
//
// NOTICE: Adobe permits you to use, modify, and distribute 
// this file in accordance with the terms of the Adobe license 
// agreement accompanying it. If you have received this file 
// from a source other than Adobe, then your use, modification, 
// or distribution of it requires the prior written permission 
// of Adobe.
//
//------------------------------------------------------------------------------

/*
@@@START_XML@@@
<?xml version="1.0" encoding="UTF-8"?>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="en_US">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>This script enables other applications to communicate with Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fr_FR">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Ce script permet à d'autres applications de communiquer avec Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ja_JP">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>このスクリプトは、他のアプリケーションと Adobe Animate との通信を有効にします。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="de_DE">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Mithilfe dieses Skripts können andere Anwendungen mit Adobe Animate kommunizieren.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="it_IT">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Questo script consente ad altre applicazioni di comunicare con Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="es_ES">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Este script posibilita que otras aplicaciones se comuniquen con Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="nl_NL">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Dit script laat andere toepassingen toe te communiceren met Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pt_BR">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Este script permite que outros aplicativos se comuniquem com o Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="nb_NO">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Skriptet gjør at andre programmer kan kommunisere med Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="da_DK">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Dette script betyder, at andre programmer kan kommunikere med Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fi_FL">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Tämän komentosarjan avulla muut sovellukset ja Adobe Animate voivat kommunikoida keskenään.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="sv_SE">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Det här skriptet gör det möjligt för andra program att kommunicera med Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_TW">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>"此指令碼能讓其他應用程式與 Adobe Animate 進行通訊。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_CN">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>"此脚本使其它应用程序能够与 Adobe Animate 进行通信</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ko_KR">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>"이 스크립트를 사용하면 다른 응용 프로그램에서 Adobe Animate과(와) 통신할 수 있습니다.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="cs_CZ">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Tento skript umožňuje dalším aplikacím komunikovat s aplikací Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pl_PL">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Ten skrypt umożliwia innym aplikacjom komunikowanie się z programem Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ru_RU">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Этот сценарий позволяет другим приложениям обмениваться данными с Adobe Animate.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="tr_TR">
     <dc:title>Adobe Animate CC</dc:title>
     <dc:description>Bu komut dosyası, diğer uygulamaların Adobe Animate ile iletişim kurmasını sağlar.</dc:description>
</ScriptInfo>
@@@END_XML@@@
*/
//--------------------------------------------------------------------
// ANIMATE COMMON INTERFACE
//--------------------------------------------------------------------


var FL = new Object();
var fl = FL;	// Also support
var flashAppName = "flash-16.0";
var bridgeAppName = "bridge";
//---------------------------------------------------------
// quit -  If open, Quit the Animate application
//

FL.quit = function ( )
{
	if (BridgeTalk.isRunning(flashAppName)) // First check if Animate is open 
	{
		FL.sendScriptToFlash( 'fl.quit();' );
	}
}

//---------------------------------------------------------
// open - Open list of files or sites
//

FL.open = function ( files )
{
	FL.sendScriptToFlash( 'fl.openDocument('+FL.argsToString(arguments)+');');
}

//---------------------------------------------------------
// reveal - If the specified file is open, show it
//

FL.reveal = function ( file_location ) 
{
	FL.sendScriptToFlash( 'app.reveal('+FL.argsToString(arguments)+');');
}

//---------------------------------------------------------
// executeScript - Execute the specified script files
//

FL.executeScript = function ( script_file )
{
	return FL.sendScriptToFlash( 'app.executeScript('+FL.argsToString(arguments)+');');
}


//--------------------------------------------------------------------
// ANIMATE SPECIFIC CODE
//--------------------------------------------------------------------


if( app.name == flashAppName && (module.name == 'DefaultScript' || module.name == 'Flash') )
{
    eval( 'BridgeTalk.onReceive = function( obj ) { return eval( obj.body, true ); }', true );
} // End of Animate specific code



//--------------------------------------------------------------------
// BRIDGE UI
//--------------------------------------------------------------------


//---------------------------------------------------------
// Create Bridge Specific UI
//

if( BridgeTalk.appName == bridgeAppName )
{
	// create main menu object		
	var placeInFlashMenu = MenuElement.create( 'command', 
		localize("$$$/extendscript/flash/PlaceInFlash/PlaceInAnimateStage=In Animate"), 
		'at the end of submenu/Place', 'PlaceInAnimateStage' );
	
	var placeInFlashLibMenu = MenuElement.create( 'command', 
		localize("$$$/extendscript/flash/PlaceInFlash/PlaceInAnimateLib=In Animate Library"), 
		'at the end of submenu/Place', 'PlaceInAnimateLib' );
	// open file on stage
	placeInFlashMenu.onSelect = function()
	{

		//Get the files, may be remote/version cue
		var sel = app.document.selections;
		app.acquirePhysicalFiles(sel);
		var filesArray = FL.thumbnailsToFiles(sel);

		if (filesArray != null)
			FL.place(filesArray, false);
	}
	// open file in document's library
	placeInFlashLibMenu.onSelect = function()
	{
		// Get the files, may be remote/version cue
		var sel = app.document.selections;
		app.acquirePhysicalFiles(sel);
		var filesArray = FL.thumbnailsToFiles(sel);

		if (filesArray != null)
			FL.place(filesArray, true);

	}
   
	placeInFlashMenu.onDisplay = function()
	{
		this.enabled = false;

//??? BridgeTalk.isRunning is always returning false #1116359, so always enabling menu even if Flash is not running
//???		if( BridgeTalk.isRunning('flash') && app.document.selections.length > 0 )
		if( app.document.selections.length > 0 )
				this.enabled = true;
	}

	placeInFlashLibMenu.onDisplay = function()
	{
		this.enabled = false;

//??? BridgeTalk.isRunning is always returning false #1116359, so always enabling menu even if Flash is not running
//???		if( BridgeTalk.isRunning('flash') && app.document.selections.length > 0 )
		if( app.document.selections.length > 0 )
				this.enabled = true;
	}
} // End of Bridge specific code


//--------------------------------------------------------------------
// UTILITIES
//--------------------------------------------------------------------


//---------------------------------------------------------
// sendScriptToFlash - Send script to be evaluated in Flash
//
// Description:
//

FL.sendScriptToFlash = function( code )
{
	//alert("Sending: '"+code+"'");
	if (app.name == flashAppName )
	{	// Just execute the code if we are already in Flash
		return eval(code);
	} else {
		// Create a new BridgeTalk message for Flash to invoke Quit
		var btMessage = new BridgeTalk;
		btMessage.target = flashAppName;
		btMessage.body = code;
		btMessage.onResult = function() {BridgeTalk.bringToFront(flashAppName);}
		btMessage.send();
	}
}


//---------------------------------------------------------
// argsToString -  
//
// Description:
//	This routine create a string for the arguments that we can transmit
//	over BridgeTalk as text.
//
FL.argsToString = function ( args )
{
	alert("In argsToString");
	var outArgs = new Array();
	
	for( var index=0; index<args.length; index++ )
	{
		outArgs.push(args[index].toSource());
	}
		
	return outArgs.join(',');
}


//---------------------------------------------------------
// thumbnailsToFiles -  
//
// Description:
//	Convert a bridge thumbnails list to file references.
//

FL.thumbnailsToFiles = function ( thumbList )
{
	var outFileList = new Array();
	var foundAlias = false;
	var	tempStr = new String();
	
	for( var index=0; index<thumbList.length; index++ )
	{
		var file = thumbList[index].spec;
		if (file)
			file = FL.resolveFileIfAlias(file);
		
		if (thumbList[index].location == "VersionCue"){
			if(file && !file.exists) {
				alert("Please make sure selected Version Cue file(s) exist on the local system.");
				return null;
			}
			tempStr = thumbList[index].spec.fsName;
		}
		else
			tempStr = thumbList[index].path;
		tempStr = tempStr.replace(":", "|");
		tempStr = tempStr.replace(/\\/g, "/");
		outFileList.push("\"file:///"+tempStr+"\"");
	}
		
	return outFileList.join(',');
	}
//---------------------------------------------------------
// place -  insert files into active document
//
// Description: Place attempts to insert the specified files
//	into the current open documet. If no document is open, it creates
// and opens one
FL.place = function( fileListIn, placeInLibrary )
{
var fileList = new Array();
var filelistStr="";
var tempStr="";
fileList = fileListIn.split(',');
if (fileList.length != 0) {
	var script = "fl.bringToFront(); var libItemsCount = 0; var res = 1; var itemsToAdd =" +fileList.length +"; var doc = fl.getDocumentDOM();\n if (doc!= undefined){\n libItemsCount = doc.library.items.length; doc.selectAll(); var selectedCountAfter = 0; var selectedCountBefore = doc.selection.length;"
	var i;
	for (i = 0; i < fileList.length; i++){
		file = fileList[i];
		if (file.length)
			filelistStr = filelistStr + "doc.importFile(" + file + "," + placeInLibrary + ", true, true);";
			tempStr = "\"" + file.substring(file.lastIndexOf('\/')+1, file.length);
			tempStr = tempStr.replace("|", ":");
			tempStr = tempStr.replace(/\//g, "\\");	
			filelistStr = 	filelistStr + "res = res && doc.library.itemExists(" + tempStr + ");"
			// this is a temp fix which allows not to report error on import od DXF file, which for some reason
			// don't get placed into library on import
			if(tempStr.match(/.dxf/gi))
				filelistStr = 	filelistStr + "res = 1;";
	}
	script = script + filelistStr + "} else {\n doc = fl.createDocument();libItemsCount = doc.library.items.length;\n" + filelistStr + "}";
	script = script + "\ndoc.selectAll(); selectedCountAfter = doc.selection.length; doc.selectNone();";
	BridgeTalk.bringToFront(flashAppName);
	FL.sendScriptToFlash(script);
	}
}

//-----------------------------------------------------------------
// If file is an alias: returns file's target if file is
// successfully resolved and the target exists, otherwise null. If
// file is not an alias: returns file.
//-----------------------------------------------------------------

FL.resolveFileIfAlias = function (file)
	{
	if (file.alias)
		{
		try
			{
			file = file.resolve();
			}
		catch (e)
			{
			file = null;
			}
			
		// On Windows, a shorcut may get resolved even if the target file doesn't exist
		if ((file != null) && !file.exists)
			return null;
		}
	return file;
	}