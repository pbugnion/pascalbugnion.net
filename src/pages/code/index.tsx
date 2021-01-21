import * as React from "react"

import Collapse from "react-bootstrap/Collapse"
import Button from "react-bootstrap/Button"

import Layout from "../../components/layout"
import Navbar from "../../components/navbar"

import gmapsImage from "./images/gmaps_demo.png"
import facultyPlatformImage from "./images/faculty-platform.png"

import styles from "./index.module.css"

const Card = ({heading, lead, imageSource, children}) => {
    const [descriptionExpanded, setDescriptionExpanded] = React.useState(false)

    return (
        <div className={`card ${styles.cardContainer}`}>
            <div className="card-body">
                <h2 className="heading">{heading}</h2>
                <p className="lead">{lead}</p>
                <img src={imageSource} width="100%" />
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

export default () => {
    return (
        <Layout>
            <header>
                <Navbar />
            </header>
            <main>
                <div className="container content-container">
                    <div className="row">
                        <div className="col-lg-6">

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
                                    gmaps has been downloaded over <a href="https://anaconda.org/conda-forge/gmaps">130,000 times</a> using conda alone. It has over 600 stars on GitHub.
                                </p>
                                <div className="link-array">
                                    <a href="https://github.com/pbugion/gmaps">GitHub</a>
                                    <a href="https://jupyter-gmaps.readthedocs.io">Documentation</a>
                                </div>
                            </Card>

                            <Card
                                heading="Faculty Platform"
                                lead="A data science workbench for teams"
                                imageSource={facultyPlatformImage}
                            >
                                <p>
                                    <a href="https://faculty.ai/products-services/platform/">Faculty platform</a> aims to be the place in which data science is done for teams. By creating a shared execution environment in which data scientists can operate in, as well as a place to host models and keep track of experiments, it reduces the friction associated with the operation of a data science team.
                                </p>
                                <p>
                                    It is typically deployed inside an organisation's infrastructure, allowing data scientists to access databases behind corporate firewalls.
                                </p>
                                <p>
                                    Faculty platform is powered by open source tools, such as the <a href="https://jupyter.org/">Jupyter</a> ecosystem, <a href="https://mlflow.org/">MLFlow</a>, and <a href="https://plot.ly/dash/">Plotly Dash</a>.
                                </p>
                                <p>
                                    Faculty Platform is developed by Faculty. I work predominantly on backend application code and the infrastructure layer. I also have technical lead and, occasionally, product ownership responsibilities. As the first engineer to work on the platform team, I have guided the growth and development of the platform since its inception.
                                </p>
                                <div class="link-array">
                                    <a href="https://faculty.ai/products-services/platform/">Website</a>
                                    <a href="https://docs.faculty.ai/">Documentation</a>
                                </div>
                            </Card>

                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}