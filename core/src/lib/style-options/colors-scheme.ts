export type primaryButtonColors = {
    buttonSuccess: [string, string,], // [color, background]
    buttonWarning: [string, string], // [color, background]
    buttonInfo: [string, string], // [color, background]
}


export type buttonSuccess = [string, string]
// export type buttonWarning = string

export type buttonType = 'buttonSuccess' | 'buttonWarning' | 'buttonDanger' | 'buttonInfo'

export type chartColors = {}

export class ColorScheme {
    public static primaryButtonColors : primaryButtonColors

    public static chartColors: chartColors = {}

    public setPrimaryButtonColors(primaryButtonColors: primaryButtonColors) {
        ColorScheme.primaryButtonColors = primaryButtonColors
        console.log(ColorScheme.primaryButtonColors)
    }


    public getPrimaryButtonColors() : primaryButtonColors {
        return ColorScheme.primaryButtonColors
    }
}
