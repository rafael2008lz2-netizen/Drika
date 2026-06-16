Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('images\jaleco-certo-2.png')
for ($i = 0; $i -lt $bmp.Height; $i += 50) {
    $c = $bmp.GetPixel(0, $i)
    Write-Host "Pixel (0, $i): R=$($c.R) G=$($c.G) B=$($c.B)"
}
$bmp.Dispose()
