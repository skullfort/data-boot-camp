Sub Yearly()
    ' Loop through all worksheets
    For Each ws in Worksheets

        ' Summary of information on all the stocks for one year.
        ' It is assumed here that all the stocks are grouped together by their ticker symbols and sorted by dates.

        ' Define headers for the summary of stock data
        ws.Range("I1").Value = "Ticker"
        ws.Range("J1").Value = "Yearly Change"
        ws.Range("K1").Value = "Percent Change"
        ws.Range("L1").Value = "Total Stock Volume"
        
        ' Initilize the variables and their values
        Dim vol As LongLong
        Dim opening As Double
        Dim ticker_row As Long

        vol = 0 ' Total volume of the first stock initialized to be 0 
        opening = ws.Range("C2").Value ' Opening price for the first stock at the beginning of a given year
        ticker_row = 2 ' Row number for placing the summary of information on the first stock 
        
        ' Iterate from the first non-header row to the last non-blank row
        For i = 2 To ws.Cells(Rows.Count, 1).End(xlUp).Row
            ' If the stock ticker symbol is about to change
            If ws.Range("A" & i + 1).Value <> ws.Range("A" & i).Value Then
                ' Record the ticker symbol of the current row, i.e. the ticker symbol for the current stock before it's about to change
                ws.Range("I" & ticker_row).Value = ws.Range("A" & i).Value
                ' Subtract from the closing price of the current row the opening price stored, which corresponds to the yearly change for the current stock
                ws.Range("J" & ticker_row).Value = ws.Range("F" & i).Value - opening
                ' Apply conditional formatting to the yearly change: green for positive and red for negative
                If ws.Range("J" & ticker_row).Value > 0 Then
                    ws.Range("J" & ticker_row).Interior.ColorIndex = 4
                Elseif ws.Range("J" & ticker_row).Value < 0 Then
                    ws.Range("J" & ticker_row).Interior.ColorIndex = 3
                End If
                ' Divide the yearly change by the opening price stored to calculate the percentage change
                ws.Range("K" & ticker_row).Value = ws.Range("J" & ticker_row).Value / opening
                ' Apply percentage format to the percentage change
                ws.Range("K" & ticker_row).NumberFormat = "0.00%"
                ' Add the stock volume of the last data entry of the current stock to its total stock volume
                ws.Range("L" & ticker_row).Value = vol  + ws.Range("G" & i).Value
                ' As long as the iteration has not come to the end of the worksheet
                If i <> ws.Cells(Rows.Count, 1).End(xlUp).Row Then
                    vol = 0 ' Total volume of the next stock initialized to be 0 
                    opening = ws.Range("C" & i + 1).Value ' Opening price for the next stock at the beginning of a given year
                    ticker_row = ticker_row + 1 ' Row number for placing the summary of information on the next stock 
                End If
            ' If the stock ticker symbol is not about to change
            Else
                ' Add the stock volume of the latest data entry of the current stock to its total stock volume
                vol = vol + ws.Range("G" & i).Value
            End If
        Next i

        ' Find the stock with the "Greatest % Increase", "Greatest % Decrease", and "Greatest Total Volume"
        ' Define headers
        ws.Range("P1").Value = "Ticker"
        ws.Range("Q1").Value = "Value"
        ws.Range("O2").Value = "Greatest % Increase"
        ws.Range("O3").Value = "Greatest % Decrease"
        ws.Range("O4").Value = "Greatest Total Volume"

        ' Initilize the variables and their values
        Dim max_percent_increase, max_percent_decrease As Double
        Dim max_total_vol As LongLong
        Dim id_max_percent_increase, id_max_percent_decrease, id_max_total_vol As Integer

        max_percent_increase = 0 ' Maximum % increase initialized to be 0
        max_percent_decrease = 0 ' Maximum % decrease initialized to be 0
        max_total_vol = 0 ' Maximum total stock volume initialized to be 0 
        
        ' Take advantage of the ticker_row computed from the previous For loop to iterate through all the stocks to find the stock of interest
        For i = 2 To ticker_row
            ' If the percent change of the current stock is positive and greater than the maximum percent increase stored
            If ws.Range("K" & i).Value > 0 And ws.Range("K" & i).Value > max_percent_increase Then
                ' Update the maximum percent increase and the row id of the corresponding stock
                id_max_percent_increase = i
                max_percent_increase = ws.Range("K" & i).Value
            ' If the percent change of the current stock is negative and less than the maximum percent decrease stored
            ElseIf ws.Range("K" & i).Value < 0 And ws.Range("K" & i).Value < max_percent_decrease Then
                ' Update the maximum percent decrease and the row id of the corresponding stock
                id_max_percent_decrease = i
                max_percent_decrease = ws.Range("K" & i).Value
            End If
            ' If the total volume of the current stock is greater than the maximum total stock volume stored
            If ws.Range("L" & i).Value > max_total_vol Then
                ' Update the maximum total stock volume and the row id of the corresponding stock
                id_max_total_vol = i
                max_total_vol = ws.Range("L" & i).Value
            End If
        Next i

        ' Tabulate the findings
        ws.Range("P2").Value = ws.Range("I" & id_max_percent_increase).Value
        ws.Range("Q2").Value = max_percent_increase
        ws.Range("Q2").NumberFormat = "0.00%"
        
        ws.Range("P3").Value = ws.Range("I" & id_max_percent_decrease).Value
        ws.Range("Q3").Value = max_percent_decrease
        ws.Range("Q3").NumberFormat = "0.00%"
        
        ws.Range("P4").Value = ws.Range("I" & id_max_total_vol).Value
        ws.Range("Q4").Value = max_total_vol
    Next ws
End Sub
