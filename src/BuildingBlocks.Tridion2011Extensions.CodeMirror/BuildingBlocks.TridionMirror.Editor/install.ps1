Write-Host "********************************************************************"
Write-Host "*           Tridion GUI Extensions Installer 1.1                   *"
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
Write-Host "*                                                                  *"
Write-Host "********************************************************************"

# import various stuff we need
[Reflection.Assembly]::LoadWithpartialName("System.Xml.Linq") | Out-Null
[string]$name = Read-Host "What is the name of the GUI Extension?"

#************* Editor - Get Install location *******************
$tridionInstallLocationUser = Read-Host "Where is Tridion installed? (Default is C:\Program Files (x86)\Tridion)"
[string]$tridionInstallLocation = "C:\Program Files (x86)\Tridion\"

if($tridionInstallLocationUser -ne "")
{
    $tridionInstallLocation = $tridionInstallLocationUser
}

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
$editorConfigFile = "Configuration\editor.config"
$modelConfigFile = "Configuration\model.config"

# Update System.config
  $filename = $tridionInstallLocation + '\web\WebUI\WebRoot\Configuration\System.config'
  $conf = [xml](gc $filename)
  
  # Editor
  $editors = [System.Xml.XmlElement]$conf.Configuration.editors
  $myElement = $conf.CreateElement("editor")
  $nameAttr = $myElement.SetAttribute("name", $name)
  $myElement.InnerXml = "<installpath>" + $editorInstallLocation + "</installpath><configuration>" + $editorConfigFile + "</configuration><vdir>" + $name + "</vdir>"
  $editors.AppendChild($myElement)
  
  #Model
  if($hasModel)
  {
                $models = [System.Xml.XmlElement]$conf.Configuration.models
                $myModelElement = $conf.CreateElement("model")
                $nameAttr = $myModelElement.SetAttribute("name", $name)
                $myModelElement.InnerXml = "<installpath>" + $modelInstallLocation + "</installpath><configuration>" + $modelConfigFile + "</configuration><vdir>" + $name + "</vdir>"
                $models.AppendChild($myModelElement)
  }
  
  $conf.Save($filename)

#************* Update IIS *******************  
# Create VDIR in Tridion/WebUI/Editors and Models  2011 / 2013 need input 
  $tridionVersion = Read-Host "Which version of Tridion do you use? (2011 or 2013.  Default is 2013)"
  if(($tridionVersion -ne "2011") -and($tridionVersion -ne "2013"))
  {
        $tridionVersion = "2013"
  }
  
  $vdirPathEditor = 'IIS:\Sites\SDL Tridion ' + $tridionVersion + '\WebUI\Editors\' + $name 
  Write-Host "Creating IIS Editor Virtual Directory at " + $vdirPathEditor
  New-Item $vdirPathEditor -type VirtualDirectory -physicalPath $editorInstallLocation

  # Model
  if($hasModel)
  {
          $vdirPathModel = 'IIS:\Sites\SDL Tridion ' + $tridionVersion + '\WebUI\Models\' + $name 
          Write-Host "Creating IIS Model Virtual Directory at " + $vdirPathModel
          New-Item $vdirPathModel -type VirtualDirectory -physicalPath $modelInstallLocation
  }
  

#************* Editor - Copy DLLs ******************* 
if(Test-Path dlls -pathType container)
{
        $webRootBin = $tridionInstallLocation + "\web\WebUI\WebRoot\bin"        
        Write-Host "Copying items to " + $webRoot
        Copy-Item -Path "dlls\*" $webRootBin -recurse
}
  
 #************* Editor - Copy Editor and Model files *******************  
Copy-Item -Path ".\Editor" $editorInstallLocation -recurse

if($hasModel)
{
    Copy-Item -Path ".\Model" $modelInstallLocation -recurse
}
       
Write-Host "============================================"
Write-Host "Done"