$files = Get-ChildItem -Path "src" -Recurse -Filter "*.spec.ts"

$updated = 0
$skipped = 0

foreach ($file in $files) {

    $content = Get-Content $file.FullName -Raw

    # فقط تست‌هایی که TestBed دارند
    if ($content -notmatch "TestBed\.configureTestingModule") {
        continue
    }

    # اگر قبلاً TEST_PROVIDERS دارند، دست نزن
    if ($content -match "TEST_PROVIDERS") {
        continue
    }

    # import مشترک را اضافه کن
    $content =
        "import { TEST_PROVIDERS } from '@testing/test-providers';`r`n" +
        $content

    # فقط configureTestingModule هایی که providers ندارند
    $pattern =
        "TestBed\.configureTestingModule\(\{"

    $replacement =
        "TestBed.configureTestingModule({`r`n      providers: [...TEST_PROVIDERS],"

    $newContent =
        [regex]::Replace(
            $content,
            $pattern,
            $replacement,
            1
        )

    if ($newContent -ne $content) {

        Set-Content `
            -Path $file.FullName `
            -Value $newContent `
            -Encoding UTF8

        Write-Host "UPDATED: $($file.FullName)"

        $updated++

    } else {

        Write-Host "SKIPPED: $($file.FullName)"

        $skipped++
    }
}

Write-Host ""
Write-Host "Updated: $updated"
Write-Host "Skipped: $skipped"