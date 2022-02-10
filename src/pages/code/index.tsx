import * as React from "react"
import { Helmet } from "react-helmet"

import Collapse from "react-bootstrap/Collapse"
import Button from "react-bootstrap/Button"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"
import CanvasBackground from "../../components/canvas-background"
import StyledAnchor from "../../components/styled-anchor"

import gmapsImage from "./images/gmaps_demo.png"
import facultyPlatformImage from "./images/faculty-platform.png"
import dbcImage from "./images/dbc.png"
import jupyterWidgetsImage from "./images/wealth_of_nations.png"

import * as styles from "./index.module.css"

type CardProps = {
  heading: string,
  lead: string,
  imageSource?: string,
  children: React.ReactNode
}

const Card = ({ heading, lead, imageSource, children }: CardProps) => {
  const [descriptionExpanded, setDescriptionExpanded] = React.useState(false)

  return (
    <div className={`card ${styles.cardContainer}`}>
      <div className="card-body">
        <h2 className="heading">{heading}</h2>
        <p className="lead">{lead}</p>
        {imageSource && <img src={imageSource} width="100%" />}
        <Collapse in={descriptionExpanded}>
          <div className={styles.collapseWrapper}>
            {children}
          </div>
        </Collapse>
      </div>
      <div className="card-footer">
        <Button onClick={() => setDescriptionExpanded(!descriptionExpanded)} className={styles.expandButton}>
          {descriptionExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>
    </div>
  )
}

const GmapsCard = () => (
  <Card
    heading="gmaps"
    lead="Google maps in Jupyter notebooks"
    imageSource={gmapsImage}
  >
    <p>
      You have some latitude and longitude data in a Python list, a numpy array or a pandas dataframe. You want to see where that data is. This plugin for Jupyter makes that easy.
        </p>
    <p>
      Visualize your data using heatmaps or symbols and overlay it with GeoJSON.
        </p>
    <p>
      gmaps has been downloaded over <StyledAnchor href="https://anaconda.org/conda-forge/gmaps">250,000</StyledAnchor> using conda alone. It has over 700 stars on GitHub.
        </p>
    <div className={styles.linkArray}>
      <StyledAnchor href="https://github.com/pbugnion/gmaps">GitHub</StyledAnchor>
      <StyledAnchor href="https://jupyter-gmaps.readthedocs.io">Documentation</StyledAnchor>
    </div>
  </Card>
)

const FacultyPlatformCard = () => (
  <Card
    heading="Faculty Platform"
    lead="A data science workbench for teams"
    imageSource={facultyPlatformImage}
  >
    <p>
      <StyledAnchor href="https://faculty.ai/products-services/platform/">Faculty platform</StyledAnchor> aims to be the place in which data science is done for teams. By creating a shared execution environment in which data scientists can operate in, as well as a place to host models and keep track of experiments, it reduces the friction associated with the operation of a data science team.
        </p>
    <p>
      It is typically deployed inside an organisation's infrastructure, allowing data scientists to access databases behind corporate firewalls.
        </p>
    <p>
      Faculty platform is powered by open source tools, such as the <StyledAnchor href="https://jupyter.org/">Jupyter</StyledAnchor> ecosystem, <StyledAnchor href="https://mlflow.org/">MLFlow</StyledAnchor>, and <StyledAnchor href="https://plot.ly/dash/">Plotly Dash</StyledAnchor>.
        </p>
    <p>
      Faculty Platform is developed by Faculty. I work predominantly on backend application code and the infrastructure layer. I also have technical lead and, occasionally, product ownership responsibilities. As the first engineer to work on the platform team, I have guided the growth and development of the platform since its inception.
        </p>
    <div className={styles.linkArray}>
      <StyledAnchor href="https://faculty.ai/products-services/platform/">Website</StyledAnchor>
      <StyledAnchor href="https://docs.faculty.ai/">Documentation</StyledAnchor>
    </div>
  </Card>
)

const DBCCard = () => (
  <Card
    heading="Dash Bootstrap components"
    lead="Responsive layouts and components for Plotly Dash"
    imageSource={dbcImage}
  >
    <p>
      Dash Bootstrap components makes it easy to structure and build your <StyledAnchor href="https://dash.plot.ly/">Plotly Dash</StyledAnchor> applications by providing layouts and high-level components that wrap Twitter Bootstrap. It allows data scientists to build engaging, responsive dashboards without worrying about the details of CSS and styling.
        </p>
    <p>
      I work on Dash Bootstrap components with <StyledAnchor href="https://tcbegley.com/">Tom Begley</StyledAnchor>.
        </p>
    <div className={styles.linkArray}>
      <StyledAnchor href="https://github.com/facultyai/dash-bootstrap-components">GitHub</StyledAnchor>
      <StyledAnchor href="https://dash-bootstrap-components.opensource.faculty.ai/">Documentation</StyledAnchor>
    </div>
  </Card>
)

const JupyterWidgetsCard = () => (
  <Card
    heading="Jupyter widgets"
    lead="Interactive visualizations in Jupyter notebooks"
    imageSource={jupyterWidgetsImage}
  >
    <p>
      Jupyter widgets let you build interactive data
            visualizations and graphical user interfaces in Jupyter
            notebooks. Widgets can be inserted into a data processing
            pipeline to understand data flows. This lets the data
            scientist explore the data interactively, leading to a
            shorter feedback loop.
        </p>
    <p>
      Jupyter widgets are an important part of the Jupyter ecosystem.
            They have been developed alongside Jupyter notebooks, with many
            of the same contributors.
        </p>
    <p>
      I started contributing regularly to the development effort in
            May 2017, and was granted commit rights in July of the same year.
        </p>
    <div className={styles.linkArray}>
      <StyledAnchor href="https://github.com/jupyter-widgets/ipywidgets">GitHub</StyledAnchor>
      <StyledAnchor href="https://ipywidgets.readthedocs.io/en/latest/">Documentation</StyledAnchor>
    </div>
  </Card>
)

const JupyterLabSqlCard = () => (
  <Card
    heading="jupyterlab-sql"
    lead="A SQL GUI in JupyterLab"
  >
    <p>
      jupyterlab-sql is a JupyterLab plugin that adds a GUI for viewing
            SQL tables and interactively composing queries. It can be used
            alongside a notebook or an editor for quickly iterating over
            SQL queries.
        </p>
    <div className={styles.linkArray}>
      <StyledAnchor href="https://github.com/pbugnion/jupyterlab-sql">GitHub</StyledAnchor>
    </div>
  </Card>

)

export default () => {
  return (
    <Layout>
      <Helmet>
        <title>Pascal Bugnion</title>
        <meta
          name="description"
          content="Pascal Bugnion is a data engineering technical lead. This hosts his musings on data, software, and team leadership."
        />
      </Helmet>
      <CanvasBackground>
        <header>
          <Navbar />
        </header>
        <main>
          <div className="container content-container">
            <div className="row">
              <div className="col-lg-6">
                <GmapsCard />
                <DBCCard />
                <JupyterLabSqlCard />
              </div>
              <div className="col-lg-6">
                <FacultyPlatformCard />
                <JupyterWidgetsCard />
              </div>
            </div>
          </div>
        </main>
      </CanvasBackground>
    </Layout>
  )
}
