import {Component} from 'react'

import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.loading,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        skillsList: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        similarJobsList: data.similar_jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          rating: eachJob.rating,
          title: eachJob.title,
        })),
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSimilarProducts = () => {
    const {jobDetails} = this.state
    const {similarJobsList} = jobDetails
    return (
      <>
        <h1 className="main-heading">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobsList.map(eachSimilarJob => (
            <Link
              className="link"
              to={`/jobs/${eachSimilarJob.id}`}
              key={eachSimilarJob.id}
            >
              <li className="list-card">
                <div className="job-logo-container">
                  <img
                    src={eachSimilarJob.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-logo"
                  />
                  <div className="job-title-container">
                    <h1 className="job-title">{eachSimilarJob.title}</h1>
                    <div className="rating-container">
                      <AiFillStar className="star" />
                      <p className="rating">{eachSimilarJob.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="description-title">Description</h1>
                <p className="description">{eachSimilarJob.jobDescription}</p>
                <div className="location-salary-container">
                  <IoLocationSharp className="icon" />
                  <p className="location">{eachSimilarJob.location}</p>
                  <BsBriefcaseFill className="icon" />
                  <p className="location intern">
                    {eachSimilarJob.employmentType}
                  </p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </>
    )
  }

  renderJobItemDetails = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      companyWebsiteUrl,
      lifeAtCompany,
      skillsList,
      rating,
      title,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <>
        <div className="job-card-item">
          <div className="job-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="job-title-container">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-salary-container">
            <IoLocationSharp className="icon" />
            <p className="location">{location}</p>
            <BsBriefcaseFill className="icon" />
            <p className="location intern">{employmentType}</p>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="company-website-url-container">
            <h1 className="description-title-link">Description</h1>
            <div className="anchor-container">
              <a
                href={companyWebsiteUrl}
                className="ext-link"
                target="_blank"
                rel="noreferrer"
              >
                Visit
              </a>
              <FiExternalLink className="external-link-icon" />
            </div>
          </div>
          <p className="description-item">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skillsList.map(eachSkill => (
              <li className="skill-list" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-img"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="company-life-heading">Life at Company</h1>
          <div className="company-life-details-container">
            <p className="description-com">{description}</p>
            <img src={imageUrl} alt="life at company" className="company-img" />
          </div>
        </div>
        {this.renderSimilarProducts()}
      </>
    )
  }

  renderLoadingField = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryJobResults = () => {
    this.getJobItemDetails()
  }

  renderJobItemDetailsFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-btn"
        onClick={this.onRetryJobResults}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderJobItemView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetails()
      case apiStatusConstants.loading:
        return this.renderLoadingField()
      case apiStatusConstants.failure:
        return this.renderJobItemDetailsFailureView()
      default:
        break
    }
    return null
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobItemDetails-container">
          {this.renderJobItemView()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
