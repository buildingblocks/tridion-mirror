# CodeMirror Syntax Highlighting Tridion GUI Extension

**Purpose:** Add syntax highlighting to the source tab of a Template Building Block View in SDL Tridion 2011.  
**Version** 0.31 BETA  
**Supports:** SDL Tridion 2011 including Razor Mediator, SDL Tridion 2013
**Licence:** MIT

Initial version developed at Building Blocks (http://www.building-blocks.com)

**Contributors:**

 * Robert Stevenson-Leggett (http://github.com/rsleggett)
 * James Simm (Building Blocks, http://github.com/jimmah)
 * Bart Koopman (SDL, http://sdltridionworld.com/community/developers/bart_koopman.aspx)

**Changes in v0.31**
 
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
 
** Roadmap for v0.4 **
 
 * Update to CodeMirror 3.x
 * Settings to Auto enable the extension when the Source tab is accessed
 * Dreamweaver Full Syntax Highlighting
 * Installer
 
** Roadmap for v0.5 **

 * Autocomplete / Intellisense
 * Syntax checking for DWTs
 * Inline documentation
 * Autocomplete Component or Page fields based on a Schema

Uses the fantasic Code Mirror: http://codemirror.net/

**Please note this is an Beta, please test in your own environment**

##Screenshots
![Razor](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/razor.PNG "Extension in action with a Razor Template")
![DreamWeaver](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/DWT.PNG "Extension in action with a dreamweaver template")
![C# Fragment](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/CSharp.PNG "Extension in action with a C# fragment template")
![Compound Template](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/Compound Template.PNG "Extension in action with a Compound template")
![XSLT](https://github.com/buildingblocks/tridion-mirror/raw/master/screen-shots/XSLT.PNG "Extension in action with a XSLT template")

##Installation Instructions

 1. On build of the BuildingBlocks.Tridion2011Extensions.CodeMirror project, there is a post build event which copies the needed files to C:\Extensions\CodeMirrorExtension
 2. Take the files in that folder and put them on the Content Management Server in a folder of your choosing.
 3. In IIS, create a virtual directory under the %SDL Tridion 2011 Website%\Editors\ called CodeMirror pointing to the directory from Step 2.
 4. Find the `editors` element in %TridionDir%\web\WebUI\WebRoot\Configuration\System.config and insert the following lines before the closing `</editors>` element (remember to update installPath element to the directory from Step 2.)
 
        <editor name="CodeMirrorExtension">
	    <installpath>C:\CodeMirrorExtension\</installpath>
	    <configuration>CodeMirrorExtension.config</configuration>
	    <vdir>CodeMirror</vdir>
        </editor>
	
 5. Update the modification attribute on the server element in order to rebuild the javascript `<server version="6.1.0.55920" modification="37">`
 6. Open a Template Building Block, all being well you should see a new 'Enable Code Mirror' button on the Ribbon Toolbar.
 7. Switch to the source tab and click 'Enable Code Mirror' to begin editing! (P.S You can now use the TAB key as it was intended!)
 
## Known issues

 * Certain code structures are not fully highlighted in RazorTemplate Template Types. This functionality is work-in-progress.
