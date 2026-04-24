import {ThemeProvider, CssBaseline,createTheme,Button} from '@mui/material'

const theme = createTheme({
  typography: {
    fontFamily:["Roboto","sans-serif"].join(",")
  }
})

const Home = () => {
  return (
    <Button type="button" variant="contained">MUI button</Button>
  )
}

const App = () => {
  return(
    <ThemeProvider theme={theme}>
      <CssBaseline></CssBaseline>
      <Home></Home>
    </ThemeProvider>
  )
}

export default App;