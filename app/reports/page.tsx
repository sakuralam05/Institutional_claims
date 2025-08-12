"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Code, Globe, CheckCircle, Clock, BarChart3, FileCheck, Eye } from "lucide-react"

interface ReportConfig {
  includeExecutiveSummary: boolean
  includeDetailedClaims: boolean
  includeEvidence: boolean
  includeVisualizations: boolean
  includeMethodology: boolean
  includeRawData: boolean
}

interface ReportStats {
  totalClaims: number
  supportedClaims: number
  contradictedClaims: number
  unverifiableClaims: number
  unsupportedClaims: number
  averageTrustScore: number
  documentsAnalyzed: number
}

export default function ReportsPage() {
  const router = useRouter()
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    includeExecutiveSummary: true,
    includeDetailedClaims: true,
    includeEvidence: true,
    includeVisualizations: true,
    includeMethodology: false,
    includeRawData: false,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [generatedReports, setGeneratedReports] = useState<string[]>([])

  // Mock report statistics
  const reportStats: ReportStats = {
    totalClaims: 5,
    supportedClaims: 2,
    contradictedClaims: 1,
    unverifiableClaims: 1,
    unsupportedClaims: 1,
    averageTrustScore: 57,
    documentsAnalyzed: 1,
  }

  const reportSections = [
    {
      id: "includeExecutiveSummary",
      title: "Executive Summary",
      description: "High-level overview of findings and key insights",
      icon: <FileCheck className="h-4 w-4" />,
      recommended: true,
    },
    {
      id: "includeDetailedClaims",
      title: "Detailed Claims Analysis",
      description: "Complete breakdown of each claim with consistency ratings",
      icon: <FileText className="h-4 w-4" />,
      recommended: true,
    },
    {
      id: "includeEvidence",
      title: "Supporting Evidence",
      description: "Source citations and evidence snippets for each claim",
      icon: <CheckCircle className="h-4 w-4" />,
      recommended: true,
    },
    {
      id: "includeVisualizations",
      title: "Charts and Visualizations",
      description: "Pie charts, bar graphs, and visual data representations",
      icon: <BarChart3 className="h-4 w-4" />,
      recommended: true,
    },
    {
      id: "includeMethodology",
      title: "Methodology Section",
      description: "Technical details about the analysis process and AI models used",
      icon: <Code className="h-4 w-4" />,
      recommended: false,
    },
    {
      id: "includeRawData",
      title: "Raw Data Export",
      description: "Machine-readable data for further analysis (JSON format only)",
      icon: <Globe className="h-4 w-4" />,
      recommended: false,
    },
  ]

  const generationSteps = [
    "Compiling analysis results...",
    "Generating executive summary...",
    "Formatting claims data...",
    "Creating visualizations...",
    "Building report structure...",
    "Finalizing document...",
  ]

  const simulateReportGeneration = async (format: string) => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGeneratedReports([])

    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(generationSteps[i])
      const stepProgress = ((i + 1) / generationSteps.length) * 100

      for (let j = 0; j <= 100; j += 20) {
        const totalProgress = (i / generationSteps.length) * 100 + j / generationSteps.length
        setGenerationProgress(Math.min(totalProgress, stepProgress))
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    setCurrentStep("Report generated successfully!")
    setGenerationProgress(100)
    setGeneratedReports([format])

    setTimeout(() => {
      setIsGenerating(false)
      setGenerationProgress(0)
      setCurrentStep("")
    }, 2000)
  }

  const updateReportConfig = (key: keyof ReportConfig, value: boolean) => {
    setReportConfig((prev) => ({ ...prev, [key]: value }))
  }

  const getEstimatedSize = () => {
    let baseSize = 2 // Base report size in MB
    if (reportConfig.includeDetailedClaims) baseSize += 1
    if (reportConfig.includeEvidence) baseSize += 2
    if (reportConfig.includeVisualizations) baseSize += 1.5
    if (reportConfig.includeMethodology) baseSize += 0.5
    if (reportConfig.includeRawData) baseSize += 3
    return baseSize.toFixed(1)
  }

  const mockHtmlReport = `
<!DOCTYPE html>
<html>
<head>
    <title>Institutional Claim Audit Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
        .summary { background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .claim { border-left: 4px solid #10B981; padding: 15px; margin: 15px 0; background: #F9FAFB; }
        .contradicted { border-left-color: #EF4444; }
        .trust-score { font-size: 24px; font-weight: bold; color: #3B82F6; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Institutional Claim Audit Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="summary">
        <h2>Executive Summary</h2>
        <p>Analysis of ${reportStats.documentsAnalyzed} document(s) revealed ${reportStats.totalClaims} claims with an average trust score of <span class="trust-score">${reportStats.averageTrustScore}/100</span>.</p>
        <ul>
            <li>${reportStats.supportedClaims} claims were supported by evidence</li>
            <li>${reportStats.contradictedClaims} claims were contradicted</li>
            <li>${reportStats.unverifiableClaims} claims were unverifiable</li>
            <li>${reportStats.unsupportedClaims} claims lacked sufficient support</li>
        </ul>
    </div>
    
    <h2>Detailed Analysis</h2>
    <div class="claim">
        <h3>Environmental Claim</h3>
        <p><strong>Claim:</strong> Our company reduced carbon emissions by 25% in 2023 compared to 2022 baseline.</p>
        <p><strong>Status:</strong> Supported</p>
        <p><strong>Trust Score:</strong> 85/100</p>
        <p><strong>Evidence:</strong> EPA emissions data confirms 24.8% reduction in reported emissions.</p>
    </div>
    
    <div class="claim contradicted">
        <h3>Environmental Claim</h3>
        <p><strong>Claim:</strong> We achieved a 40% increase in renewable energy usage across all facilities.</p>
        <p><strong>Status:</strong> Contradicted</p>
        <p><strong>Trust Score:</strong> 25/100</p>
        <p><strong>Evidence:</strong> EIA data shows only 15.2% increase in renewable energy consumption.</p>
    </div>
</body>
</html>`

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Reports</h1>
          <p className="text-gray-600">
            Create comprehensive audit reports in multiple formats for sharing and documentation.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>Select the sections to include in your audit report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportSections.map((section) => (
                  <div key={section.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={section.id}
                      checked={reportConfig[section.id as keyof ReportConfig]}
                      onCheckedChange={(checked) =>
                        updateReportConfig(section.id as keyof ReportConfig, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {section.icon}
                        <Label htmlFor={section.id} className="font-medium cursor-pointer">
                          {section.title}
                        </Label>
                        {section.recommended && <Badge variant="outline">Recommended</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Report Formats */}
            <Card>
              <CardHeader>
                <CardTitle>Download Formats</CardTitle>
                <CardDescription>Choose your preferred format for the audit report</CardDescription>
              </CardHeader>
              <CardContent>
                {!isGenerating ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => simulateReportGeneration("PDF")}
                      className="h-20 flex-col space-y-2 bg-red-600 hover:bg-red-700"
                    >
                      <FileText className="h-6 w-6" />
                      <span>Download PDF</span>
                    </Button>
                    <Button
                      onClick={() => simulateReportGeneration("HTML")}
                      variant="outline"
                      className="h-20 flex-col space-y-2"
                    >
                      <Globe className="h-6 w-6" />
                      <span>Download HTML</span>
                    </Button>
                    <Button
                      onClick={() => simulateReportGeneration("JSON")}
                      variant="outline"
                      className="h-20 flex-col space-y-2"
                    >
                      <Code className="h-6 w-6" />
                      <span>Download JSON</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Generating Report...</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{currentStep}</span>
                        <span className="text-gray-600">{Math.round(generationProgress)}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  </div>
                )}

                {generatedReports.length > 0 && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Report generated successfully! Your download should start automatically.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Report Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{reportStats.totalClaims}</div>
                    <div className="text-sm text-gray-600">Total Claims</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{reportStats.supportedClaims}</div>
                    <div className="text-sm text-gray-600">Supported</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{reportStats.contradictedClaims}</div>
                    <div className="text-sm text-gray-600">Contradicted</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{reportStats.averageTrustScore}</div>
                    <div className="text-sm text-gray-600">Avg. Score</div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Documents Analyzed:</span>
                    <span className="font-medium">{reportStats.documentsAnalyzed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Size:</span>
                    <span className="font-medium">{getEstimatedSize()} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Generated:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Report Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html">HTML Preview</TabsTrigger>
                    <TabsTrigger value="json">JSON Structure</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html" className="mt-4">
                    <div className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
                      <div dangerouslySetInnerHTML={{ __html: mockHtmlReport }} />
                    </div>
                  </TabsContent>
                  <TabsContent value="json" className="mt-4">
                    <div className="border rounded-lg p-4 bg-gray-900 text-green-400 max-h-96 overflow-y-auto">
                      <pre className="text-xs">
                        {JSON.stringify(
                          {
                            reportMetadata: {
                              generatedAt: new Date().toISOString(),
                              version: "1.0.0",
                              totalClaims: reportStats.totalClaims,
                              averageTrustScore: reportStats.averageTrustScore,
                            },
                            claims: [
                              {
                                id: "1",
                                text: "Our company reduced carbon emissions by 25%...",
                                category: "Environmental",
                                consistency: "Supported",
                                trustScore: 85,
                                evidence: ["EPA emissions data confirms..."],
                              },
                            ],
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push("/results")}>
            Back to Results
          </Button>
          <Button onClick={() => router.push("/review")} className="bg-blue-600 hover:bg-blue-700">
            Review & Annotate Claims
          </Button>
        </div>
      </main>
    </div>
  )
}
