Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("c:\Users\Rafa\Downloads\appparaescola\Drika catalogo\images\logo-drika.jpg")
$width = $bmp.Width
$height = $bmp.Height
$newBmp = New-Object System.Drawing.Bitmap($width, $height)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        $luminance = [int](0.299 * $pixel.R + 0.587 * $pixel.G + 0.114 * $pixel.B)
        $newColor = [System.Drawing.Color]::FromArgb($luminance, 255, 255, 255)
        $newBmp.SetPixel($x, $y, $newColor)
    }
}

$newBmp.Save("c:\Users\Rafa\Downloads\appparaescola\Drika catalogo\images\logo-drika-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Done!"
