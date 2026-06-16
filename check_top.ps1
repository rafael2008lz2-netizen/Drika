Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('images\jaleco-certo-2.png')
for ($i = 0; $i -lt $bmp.Width; $i += 50) {
    $c = $bmp.GetPixel($i, 0)
    Write-Host "Pixel ($i, 0): R=$($c.R) G=$($c.G) B=$($c.B)"
}
$bmp.Dispose()
