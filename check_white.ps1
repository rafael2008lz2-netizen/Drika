Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('images\jaleco-certo-2.png')
$whiteCount = 0
$transCount = 0
for ($y = 0; $y -lt 10; $y++) {
    $c = $bmp.GetPixel(0, $y)
    if ($c.A -eq 0) { $transCount++ }
    if ($c.R -gt 250 -and $c.G -gt 250 -and $c.B -gt 250 -and $c.A -gt 250) { $whiteCount++ }
}
Write-Host "Top left 10 pixels: $whiteCount white, $transCount transparent"
$bmp.Dispose()
