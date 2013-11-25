[CmdletBinding()]
param(
	[string]$tridionInstallLocation = "C:\Program Files (x86)\Tridion\",
	[string]$iisWebsiteName = "SDL Tridion",
	[string]$name = ""
)

$ErrorActionPreference = "Stop"

Write-Host "********************************************************************"
Write-Host "*           Tridion GUI Extensions Installer 1.2                   *"
Write-Host "*                                                                  *"
Write-Host "*           Originally by Robert Curlette                          *"
Write-Host "*           Updated by Robert Stevenson-Leggett                    *"
Write-Host "*                                                                  *"
Write-Host "*  Create the following structure in the same folder as this file: *"
Write-Host "*       /Editor/                                                   *"
Write-Host "*       /Editor/Configuration/editor.config                        *"
Write-Host "*       /Model/ (optional)                                         *"
Write-Host "*       /Model/Configuration/model.config                          *"
Write-Host "*       /dlls/ (optional)                                          *"
Write-Host "*                                                                  *"
Write-Host "*  Copies dll files to WebRoot bin                                 *"
Write-Host "*  Copies all other files to Extension root                        *"
Write-Host "*  Creates VDir in Editors section in Tridion IIS                  *"
Write-Host "*  Updates System.config                                           *"
Write-Host "*                                                                  *"
Write-Host "********************************************************************"

# import various stuff we need
Import-Module webadministration
[Reflection.Assembly]::LoadWithpartialName("System.Xml.Linq") | Out-Null

#************* Editor - Get Install location *******************

[string]$editorInstallLocation = $tridionInstallLocation + "web\WebUI\Editors\" + $name
if(Test-Path model -pathType container)
{
    [bool]$hasModel = 1
}

if($hasModel)
{
    [string]$modelInstallLocation = $tridionInstallLocation + "web\WebUI\Models\" + $name
}

Write-Host "Installing GUI Extension Editor to " + $editorInstallLocation

#************* Editor - Update Config *******************
$scriptPath = Split-Path -parent $PSCommandPath

$editorConfigFile = "Editor\Configuration\editor.config"
$modelConfigFile = "Editor\Configuration\model.config"

# Update System.config
$filename = $tridionInstallLocation + '\web\WebUI\WebRoot\Configuration\System.config'
$conf = [xml](gc $filename)
  
[System.Xml.XmlNamespaceManager] $nsm = new-object System.Xml.XmlNamespaceManager $conf.NameTable
$nsm.AddNamespace("x", "http://www.sdltridion.com/2009/GUI/Configuration")

# Editor
$editorNodeExists = @($conf.Configuration.editors.editor.name) -contains $name
if(!$editorNodeExists)
{
	$editors = [System.Xml.XmlElement]$conf.Configuration.editors
	$myElement = $conf.CreateElement("editor", $nsm.LookupNamespace("x"))
	$nameAttr = $myElement.SetAttribute("name", $name)
	$myElement.InnerXml = "<installpath xmlns='http://www.sdltridion.com/2009/GUI/Configuration'>" + $editorInstallLocation + "</installpath><configuration xmlns='http://www.sdltridion.com/2009/GUI/Configuration'>" + $editorConfigFile + "</configuration><vdir xmlns='http://www.sdltridion.com/2009/GUI/Configuration'>" + $name + "</vdir>"
	$editors.AppendChild($myElement)
}
else
{
	Write-Host "Editor node already exists in System.config with name $name, skipping"
}

# Model
$modelNodeExists = @($conf.Configuration.editors.editor.name) -contains $name
if($hasModel -and (!$modelNodeExists))
{
	$models = [System.Xml.XmlElement]$conf.Configuration.models
	$myModelElement = $conf.CreateElement("model", $nsm.LookupNamespace("x"))
	$nameAttr = $myModelElement.SetAttribute("name", $name)
	$myModelElement.InnerXml = "<installpath xmlns='http://www.sdltridion.com/2009/GUI/Configuration'>" + $modelInstallLocation + "</installpath><configuration xmlns='http://www.sdltridion.com/2009/GUI/Configuration'>" + $modelConfigFile + "</configuration><vdir xmlns='http://www.sdltridion.com/2009/GUI/Configuration'>" + $name + "</vdir>"
	$models.AppendChild($myModelElement)
}
elseif($existingModelNode -ne $null)
{
	Write-Host "Model node already exists in System.config with name $name, skipping"
}
  
# Update modification number to reload JavaScript
# <server version="7.0.0.568" modification="15">
$server = [System.Xml.XmlElement]$conf.Configuration.servicemodel.server
$modificationNumber = [int]$server.GetAttribute("modification")
$server.SetAttribute("modification", $modificationNumber + 1)

$conf.Save($filename)

#************* Update IIS *******************  

  $vdirPathEditor = "IIS:\Sites\$iisWebsiteName\WebUI\Editors\$name"
  Write-Host "Creating IIS Editor Virtual Directory at " $vdirPathEditor " with physical location at " $editorInstallLocation
  New-Item $vdirPathEditor -type VirtualDirectory -physicalPath $editorInstallLocation -force

  # Model
  if($hasModel)
  {
          $vdirPathModel = "IIS:\Sites\$iisWebsiteName\WebUI\Models\$name"
          Write-Host "Creating IIS Model Virtual Directory at " + $vdirPathModel
          New-Item $vdirPathModel -type VirtualDirectory -physicalPath $modelInstallLocation
  }
  
#************* Editor - Copy DLLs ******************* 
if(Test-Path bin -pathType container)
{
        $webRootBin = $tridionInstallLocation + "\web\WebUI\WebRoot\bin"        
        Copy-Item -Path "bin\*" $webRootBin -recurse
}

#************* Editor - Copy Editor and Model files *******************  
# Clean editor directory first
$editorPath = Join-Path -Path $scriptPath -ChildPath ".\Editor"
if(Test-Path $editorInstallLocation)
{
	Remove-Item $editorInstallLocation\*  -recurse -force
}
Copy-Item -Path $editorPath $editorInstallLocation -recurse -force

if($hasModel)
{
	$modelPath = Join-Path -Path $scriptPath -ChildPath ".\Model"
	Remove-Item $modelInstallLocation\*  -recurse -force
    Copy-Item -Path $modelPath $modelInstallLocation -recurse -force
}
       
Write-Host "============================================"
Write-Host "Successfully installed $name"