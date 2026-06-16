Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('images\jaleco-certo-2.png')
$c = $bmp.GetPixel(10, 10)
Write-Host "Pixel (10, 10): R=$($c.R) G=$($c.G) B=$($c.B) A=$($c.A)"
$bmp.Dispose()
