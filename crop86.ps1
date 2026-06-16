Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('c:\Users\Rafa\Downloads\appparaescola\Drika catalogo\images\Jaleco.jpg.png')
[int]$width = $img.Width
[int]$height = $img.Height
[int]$newWidth = [math]::Floor($width * 0.86)
[int]$newHeight = [math]::Floor($height * 0.86)
[int]$left = [math]::Floor(($width - $newWidth) / 2)
[int]$top = [math]::Floor(($height - $newHeight) / 2)
$rect = New-Object System.Drawing.Rectangle($left, $top, $newWidth, $newHeight)
$bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$bmp.SetResolution($img.HorizontalResolution, $img.VerticalResolution)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($img, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save('c:\Users\Rafa\Downloads\appparaescola\Drika catalogo\images\jaleco_cropped_86.png', [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bmp.Dispose()
$img.Dispose()
