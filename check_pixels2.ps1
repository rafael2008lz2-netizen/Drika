Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('images\jaleco-certo-2.png')
$c = $bmp.GetPixel($bmp.Width/2, 10)
Write-Host "Top-center pixel: R=$($c.R) G=$($c.G) B=$($c.B) A=$($c.A)"
$c2 = $bmp.GetPixel($bmp.Width/2, $bmp.Height - 10)
Write-Host "Bottom-center pixel: R=$($c2.R) G=$($c2.G) B=$($c2.B) A=$($c2.A)"
$bmp.Dispose()
