[CmdletBinding()]
param(
    [string]$SourceRoot = "$env:LOCALAPPDATA\CapCut\Videos",
    [string]$OutputDirectory = (Join-Path $PSScriptRoot "..\docs\moving-relics")
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SourceRoot)) {
    throw "CapCut video root not found: $SourceRoot"
}

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null

# Extended-length paths preserve project names that end in a space.
$extendedRoot = if ($SourceRoot.StartsWith("\\?\")) {
    $SourceRoot
} else {
    "\\?\$([System.IO.Path]::GetFullPath($SourceRoot))"
}

$excludedProjects = @(
    "Scout",
    "_nyxion_received"
)

$projects = Get-ChildItem -LiteralPath $extendedRoot -Directory -Force |
    Where-Object { $_.Name -notin $excludedProjects }

$rows = foreach ($project in $projects) {
    $trimmedProject = $project.Name.Trim()
    $variant = 1
    $workTitle = $trimmedProject

    if ($trimmedProject -match "^(?<title>.+?)\s*\((?<variant>\d+)\)$") {
        $workTitle = $Matches.title.Trim()
        $variant = [int]$Matches.variant + 1
    }

    $exports = Get-ChildItem -LiteralPath $project.FullName -File -Force |
        Where-Object { $_.Extension.ToLowerInvariant() -in @(".mov", ".mp4") } |
        Sort-Object LastWriteTime, Name

    $exportIndex = 0
    foreach ($export in $exports) {
        $exportIndex++

        [pscustomobject][ordered]@{
            WorkTitle       = $workTitle
            ProjectName     = $trimmedProject
            Variant         = $variant
            ExportIndex     = $exportIndex
            Extension       = $export.Extension.ToLowerInvariant()
            SizeMB          = [math]::Round($export.Length / 1MB, 2)
            Created         = $export.CreationTime.ToString("yyyy-MM-dd HH:mm:ss")
            LastModified    = $export.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
            SourcePath      = $export.FullName -replace "^\\\\\?\\", ""
            TikTokUrl       = ""
            TikTokPostId    = ""
            Visibility      = "unreviewed"
            SelectionStatus = "unreviewed"
            Notes           = ""
        }
    }
}

$orderedRows = $rows |
    Sort-Object WorkTitle, Variant, ExportIndex, LastModified

$csvPath = Join-Path $resolvedOutput "capcut-video-inventory.csv"
$jsonPath = Join-Path $resolvedOutput "capcut-video-inventory.json"
$summaryPath = Join-Path $resolvedOutput "inventory-summary.json"

$orderedRows | Export-Csv -LiteralPath $csvPath -NoTypeInformation -Encoding utf8
$orderedRows | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath $jsonPath -Encoding utf8

$duplicateGroups = $orderedRows |
    Group-Object WorkTitle |
    Where-Object Count -gt 1 |
    Sort-Object @{ Expression = "Count"; Descending = $true }, Name

$summary = [pscustomobject][ordered]@{
    generatedAt          = (Get-Date).ToString("o")
    sourceRoot           = $SourceRoot
    exportCount          = @($orderedRows).Count
    distinctWorkCount    = @($orderedRows | Select-Object -ExpandProperty WorkTitle -Unique).Count
    duplicateWorkCount   = @($duplicateGroups).Count
    excludedProjectNames = $excludedProjects
    duplicateWorks       = @(
        $duplicateGroups | ForEach-Object {
            [pscustomobject]@{
                title       = $_.Name
                exportCount = $_.Count
            }
        }
    )
}

$summary | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $summaryPath -Encoding utf8

Write-Host "Moving Relics inventory written to $resolvedOutput"
Write-Host "Exports: $($summary.exportCount)"
Write-Host "Distinct works: $($summary.distinctWorkCount)"
Write-Host "Duplicate-title groups: $($summary.duplicateWorkCount)"
