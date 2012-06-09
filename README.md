# CodeMirror Syntax Highlighting Tridion GUI Extension

**Purpose:** Add syntax highlighting to the source tab of a Template Building Block View in SDL Tridion 2011.  
**Version** 0.2 ALPHA  
**Supports:** SDL Tridion 2011 including Razor Mediator (Tridion 2009 support coming soon) 
**Licence:** MIT

Developed at Building Blocks (http://www.building-blocks.com)

**Author:** 
Robert Stevenson-Leggett (http://github.com/rsleggett)

**Contributors:**
 
 * James Simm (http://github.com/jimmah)

**Roadmap**
 
 * Tridion 2009 Support
 * Dreamweaver Full Syntax Highlighting
 * Autocomplete
 * Syntax checking for DWTs
 * Inline documentation
 * Autocomplete Component or Page fields based on a schema

Uses the fantasic Code Mirror: http://codemirror.net/

**Please note this is an Alpha / Proof of Concept**

##Screenshot
![Tridion GUI extension in action](https://github.com/buildingblocks/tridion-mirror/raw/master/Capture.PNG "Extension in action")

##Installation Instructions

 1. On build of the BuildingBlocks.Tridion2011Extensions.CodeMirror project, there is a post build event which copies the needed files to C:\Extensions\CodeMirrorExtension
 2. Take the files in that folder and put them on the Content Management Server in a folder of your choosing.
 3. In IIS, create a virtual directory under the %SDL Tridion 2011 Website%\Editors\ called CodeMirror pointing to the directory from Step 2.
 4. Add the following lines to the config in %TridionDir%\web\WebUI\WebRoot\Configuration\System.config (remember to update installPath element to the directory from Step 2.)
 
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