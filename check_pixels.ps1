Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('images\jaleco-certo-2.png')
$c = $bmp.GetPixel(0, 0)
Write-Host "Top-Left Pixel: R=$($c.R) G=$($c.G) B=$($c.B)"
$c2 = $bmp.GetPixel($bmp.Width/2, 5)
Write-Host "Top-Center Pixel: R=$($c2.R) G=$($c2.G) B=$($c2.B)"
$bmp.Dispose()
