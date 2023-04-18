import {Component} from 'react'

import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill, BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  return (
    <Link className="link" to={`/jobs/${id}`} key={id}>
      <li className="job-card">
        <div className="job-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <h1 className="description-title">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}

class Jobs extends Component {
  state = {
    jobsDataList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
    apiStatus: apiStatusConstants.initial,
    isProfileLoaded: false,
    profileDetails: {},
  }

  componentDidMount() {
    this.getJobDetails()
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        isProfileLoaded: true,
        profileDetails: updatedProfileData,
      })
    } else {
      this.setState({
        isProfileLoaded: false,
      })
    }
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.loading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentType, salaryRange} = this.state
    const employmentTypeString = employmentType.join()
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsDataList: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onRetry = () => {
    this.getProfileDetails()
  }

  renderProfileDetails = () => {
    const {isProfileLoaded, profileDetails} = this.state
    if (isProfileLoaded) {
      const {name, profileImageUrl, shortBio} = profileDetails
      return (
        <div className="profile-card">
          <img src={profileImageUrl} alt="profile" className="profile-pic" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-bio">{shortBio}</p>
        </div>
      )
    }
    return (
      <div className="retry-container">
        <button className="retry-btn" type="button" onClick={this.onRetry}>
          Retry
        </button>
      </div>
    )
  }

  onChangingCheckbox = event => {
    const {employmentType} = this.state
    const result = event.target.value
    console.log(result)
    if (employmentType.includes(result)) {
      const givenList = [...employmentType]
      const updatedList = givenList.filter(str => str !== result)
      this.setState(
        {
          employmentType: updatedList,
        },
        this.getJobDetails,
      )
    } else {
      this.setState(
        {
          employmentType: [...employmentType, event.target.value],
        },
        this.getJobDetails,
      )
    }
  }

  renderEmploymentTypeField = () => (
    <div className="filter-card">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="list-container">
        {employmentTypesList.map(eachType => (
          <li className="checkbox-container" key={eachType.employmentTypeId}>
            <input
              id={eachType.employmentTypeId}
              className="checkbox"
              type="checkbox"
              value={eachType.employmentTypeId}
              onChange={this.onChangingCheckbox}
            />
            <label className="label" htmlFor={eachType.employmentTypeId}>
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onChangingSalaryRadio = event => {
    this.setState(
      {
        salaryRange: event.target.value,
      },
      this.getJobDetails,
    )
  }

  renderSalaryRangeField = () => (
    <div className="filter-card">
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="list-container">
        {salaryRangesList.map(eachType => (
          <li className="checkbox-container" key={eachType.salaryRangeId}>
            <input
              id={eachType.salaryRangeId}
              className="checkbox"
              type="radio"
              name="salary"
              value={eachType.salaryRangeId}
              onChange={this.onChangingSalaryRadio}
            />
            <label className="label" htmlFor={eachType.salaryRangeId}>
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  showNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsResults = () => {
    const {jobsDataList} = this.state
    if (jobsDataList.length === 0) {
      return this.showNoJobsView()
    }
    return (
      <>
        <ul className="jobs-list-container">
          {jobsDataList.map(eachJobItem => (
            <JobItem key={eachJobItem.id} jobDetails={eachJobItem} />
          ))}
        </ul>
      </>
    )
  }

  renderLoadingField = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryJobResults = () => {
    this.getJobDetails()
  }

  renderJobsResultsFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
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

  onClickSearchButton = () => {
    this.getJobDetails()
  }

  renderSearchField = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsResults()
      case apiStatusConstants.loading:
        return this.renderLoadingField()
      case apiStatusConstants.failure:
        return this.renderJobsResultsFailureView()
      default:
        break
    }
    return null
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="search-input-mobile-container">
            <input
              className="search-input"
              value={searchInput}
              placeholder="Search"
              type="search"
              onChange={this.onChangeSearchInput}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={this.onClickSearchButton}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="job-filter-container">
            {this.renderProfileDetails()}
            <hr className="line" />
            {this.renderEmploymentTypeField()}
            <hr className="line" />
            {this.renderSalaryRangeField()}
          </div>
          <div className="search-results-container">
            <div className="search-input-container">
              <input
                className="search-input"
                value={searchInput}
                placeholder="Search"
                type="search"
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderSearchField()}
          </div>
          <div className="mobile-search-results-field">
            {this.renderSearchField()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
