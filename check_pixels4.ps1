Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('images\jaleco-certo-1.png')
$c = $bmp.GetPixel(0, 0)
Write-Host "Pixel (0, 0) of jaleco-certo-1.png: R=$($c.R) G=$($c.G) B=$($c.B) A=$($c.A)"
$bmp.Dispose()
