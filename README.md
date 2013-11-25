# CodeMirror Syntax Highlighting Tridion GUI Extension

**Purpose:** Add syntax highlighting to the source tab in SDL Tridion
**Version** 0.4 BETA  
**Supports:** SDL Tridion 2011, SDL Tridion 2013
**Licence:** MIT

Initial version developed at Building Blocks (http://www.building-blocks.com)

**Contributors:**

 * Robert Stevenson-Leggett (http://github.com/rsleggett)
 * James Simm (Building Blocks, http://github.com/jimmah)
 * Bart Koopman (SDL, http://sdltridionworld.com/community/developers/bart_koopman.aspx)
 * Jaime Santos Alcon(SDL, http://sdltridionworld.com/community/developers/jaime_santos_alcon.aspx) 

 **Changes in v0.4**
 
 * Installation script
 * Fix bug with height of Source tab being limited to 21 lines
 * Integrate Dreamweaver suggestions from Jaime Santos Alcon (Press ctrl+space)
 
**Changes in v0.32**
 
  * Support for Tridion 2013
  * Support for built in XSLT Mediator
 
**Changes in v0.3**
 
  * Updated to CodeMirror v2.38
  * Now automatically selects a new syntax highlight mode when the TBB drop down is changed
  * New Syntax Highlighting support for Compound Templates, C# Fragments,  XSLT, VBScript, JScript
  * Now available for Page Template and Component Template Views
  * Disabled Word Wrap when the plugin is enabled (thanks Bart)
  * Updated styles (thanks Bart)
  * Updated font and colour scheme (thanks Bart)
 
**Roadmap for v0.5**

 * Upgrade to CodeMirror 3.x 
 * Suggestions for Razor
 * Full screen support
 * Uninstaller

**Roadmap for v0.6**

 * Inline documentation 
 * Autocomplete Component or Page fields based on a Schema

Uses the fantasic Code Mirror: http://codemirror.net/

**Please note this is an Beta, please test in a dev environment**

##Installation Instructions

There are 2 methods to install, which one you choose depends on your preference. I recommend using the first method but you may not want to install node.js on your server.

**Please note both methods will overwrite anything in `%TRIDION_HOME%\web\WebUI\Editors\CodeMirror`

###Install using npm (The Package Manager for Node.JS)
 
 1. Install node.js from http://nodejs.org/ 
 2. Open a command prompt and run `npm install -g code-mirror-tridion`
 
###Install manually

 1. Download the latest release zip file from [TODO]
 2. Unzip to a location of your choice on your server
 3. Open the folder where you unzipped to
 4. Run call_install.bat

##Known issues

 * Certain code structures are not fully highlighted in RazorTemplate Template Types. This functionality is work-in-progress.

##Screenshots

![Razor](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/razor.PNG "Extension in action with a Razor Template")
![DreamWeaver](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/DWT.PNG "Extension in action with a dreamweaver template")
![C# Fragment](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/CSharp.PNG "Extension in action with a C# fragment template")
![Compound Template](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/Compound Template.PNG "Extension in action with a Compound template")
![XSLT](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/XSLT.PNG "Extension in action with a XSLT template")