import tinycolor from 'tinycolor2'

// Palette
// Add all colors here
export const LIGHT_PURPLE = '#534bae'
export const LIGHT_PURPLE_ANALOGOUS = tinycolor(LIGHT_PURPLE).analogous().toString()
export const DARK_BLUE = '#18227c'
export const DARK_BLUE_ANALOGOUS = tinycolor(DARK_BLUE).analogous().toString()
export const LIGHT_GREY = '#EEE'
export const MID_GREY = '#CCC'
export const DARK_GREY = '#333'
export const ORANGE = '#d35400'
export const EMERALD = '#27ae60'
export const POMEGRANATE = '#c0392b'
export const POMEGRANATE_ANALOGOUS = tinycolor(POMEGRANATE).complement().toString()
export const WHITE = 'white'


// Theme
// Assign colors to thematic roles
export const PRIMARY_LIGHT = LIGHT_PURPLE
export const PRIMARY_LIGHT_ANALOGOUS = LIGHT_PURPLE_ANALOGOUS
export const PRIMARY_DARK = DARK_BLUE
export const PRIMARY_DARK_ANALOGOUS = DARK_BLUE_ANALOGOUS


// Function
// Assign colors & roles to specific components
export const BUTTON_EDIT_COLOR = POMEGRANATE_ANALOGOUS
export const BUTTON_DELETE_COLOR = POMEGRANATE
export const BUTTON_PLUS_COLOR = POMEGRANATE
export const BUTTON_TRASH_COLOR = POMEGRANATE_ANALOGOUS

export const BUTTON_ICON_COLOR = PRIMARY_DARK
export const BUTTON_TEXT_COLOR = PRIMARY_DARK
export const BUTTON_BACKGROUND_COLOR = PRIMARY_LIGHT
export const TAB_BACKGROUND_COLOR_INACTIVE = PRIMARY_LIGHT_ANALOGOUS
export const TAB_BACKGROUND_COLOR_ACTIVE = tinycolor(PRIMARY_LIGHT_ANALOGOUS).lighten(5).toString()
export const TAB_LABEL_COLOR_ACTIVE = LIGHT_GREY
export const TAB_LABEL_COLOR_INACTIVE = PRIMARY_DARK_ANALOGOUS
export const CONFIRM_BUTTON_TEXT_COLOR = PRIMARY_DARK
export const TEXT_COLOR_DARK = DARK_GREY

export const HEADER_BACKGROUND_COLOR = PRIMARY_LIGHT_ANALOGOUS
export const HEADER_BACKGROUND_EDITING_COLOR = POMEGRANATE
export const HEADER_TITLE_COLOR = PRIMARY_DARK_ANALOGOUS
export const HEADER_TITLE_EDITING_COLOR = LIGHT_GREY
export const ICON_SELECTED_BACKGROUND_COLOR = MID_GREY
export const TEXT_COLOR_LIGHT = LIGHT_GREY
export const MODAL_BACKGROUND_COLOR = LIGHT_GREY
export const MENU_BACKGROUND_COLOR = LIGHT_GREY
export const CAPTURING_IN_PROGRESS_COLOR = POMEGRANATE
export const REMOTE_BACKGROUND_COLOR = PRIMARY_DARK
export const STATUS_BAR_COLOR = DARK_BLUE
export const STATUS_BAD_COLOR = ORANGE
export const STATUS_GOOD_COLOR = EMERALD
export const CIRCLE_PLUS_BUTTON_COLOR = POMEGRANATE_ANALOGOUS
export const TITLE_BACKGROUND_EDITING = 'rgba(255, 255, 255, 0.8)'
