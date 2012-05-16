#CodeMirror Tridion GUI Extension

Purpose: Add syntax highlighting to the source tab of a Template Building Block View in SDL Tridion 2011.  
Version 0.1 ALPHA  
Author: Robert Stevenson-Leggett  
Supports: SDL Tridion 2011  
Licence: MIT

Uses the fantasic Code Mirror: http://codemirror.net/

**Please note this is an Alpha / Proof of Concept**

##Screenshot
![Tridion GUI extension in action](https://github.com/rsleggett/tridion-mirror/raw/master/Capture.PNG "Extension in action")

##Installation Instructions

 1. On build of the project, there is a post build event which copies the needed files to C:\Extensions\CodeMirrorExension
 2. Take the files in that folder and put them on the Conent Management Server in a folder of your choosing.
 3. In IIS, create a virtual directory under the %SDL Tridion 2011 Website%\Editors\ called CodeMirror pointing to the directory from Step 2.
 4. Add the following lines to the config in %TridionDir%\web\WebUI\WebRoot\Configuration\System.config (remember to update installPath element to the directory from Step 2.)
 
        <editor name="CodeMirrorExtension" xmlns="http://www.sdltridion.com/2009/GUI/Configuration">
		    <installpath xmlns="http://www.sdltridion.com/2009/GUI/Configuration">C:\CodeMirrorExtension\</installpath>
		    <configuration xmlns="http://www.sdltridion.com/2009/GUI/Configuration">CodeMirrorExtension.config</configuration>
		    <vdir xmlns="http://www.sdltridion.com/2009/GUI/Configuration">CodeMirror</vdir>
	    </editor>
	
 5. Go to your SDL Tridion 2011 URL and hit Ctrl+F5 to ensure the cache is clear.
 6. Open a Template Building Block, all being well you should see a new 'Enable Code Mirror' button on the Ribbon Toolbar.
 7. Switch to the source tab and click 'Enable Code Mirror' to begin editting! (P.S You can now use the TAB key as it was intended!)
 
## Known issues

 In this Alpha version, enabling the Code Mirror button while not on the Source Tab will cause the code in the Template Building Block to be hidden from view. Don't panic, close the item without saving and re open.