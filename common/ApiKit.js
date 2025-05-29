import HttpKit from "./HttpKit";

const { client } = HttpKit;

const defaultFileUploadConfig = {
  headers: { "Content-Type": "multipart/form-data" },
};

const ApiKit = {
  auth: {
    customerRegister: (payload) => {
      const url = "/user/account/register-customer";
      return client.post(url, payload);
    },
    register: (payload) => {
      const url = "/user/account/register-service-provider";
      return client.post(url, payload, defaultFileUploadConfig);
    },
    login: (payload) => {
      const url = "/user/account/login";
      return client.post(url, payload);
    },
    googleLogin: (params) => {
      const url = `/social/auth/login/google`;
      return client.get(url, { params });
    },
  },

  forgotPassword: {
    sendMail: (payload) => {
      const url = "/user/account/forget-password-send-email";
      return client.post(url, payload);
    },
    resetPassword: (payload) => {
      const url = "/user/account/forget-password-reset";
      return client.post(url, payload);
    },
  },

  public: {
    category: {
      getDelivery: () => {
        const url = "/categories/delivery";
        return client.get(url);
      },
      getRemoval: () => {
        const url = "/categories/removal";
        return client.get(url);
      },
      getCleaningServices: () => {
        const url = "/categories/cleaning";
        return client.get(url);
      },
    },

    job: {
      all: {
        getJobs: (params) => {
          const url = "/public/jobs";
          return client.get(url, { params });
        },
      },
      delivery: {
        getJobs: (params) => {
          const url = "/public/jobs/delivery";
          return client.get(url, { params });
        },
        getJob: (slug) => {
          const url = `/public/jobs/delivery/${slug}`;
          return client.get(url);
        },
        getFiles: (slug) => {
          const url = `/public/jobs/delivery/${slug}/files`;
          return client.get(url);
        },
      },
      removal: {
        getJobs: (params) => {
          const url = "/public/jobs/removal";
          return client.get(url, { params });
        },
        getJob: (slug) => {
          const url = `/public/jobs/removal/${slug}`;
          return client.get(url);
        },
        getFiles: (slug) => {
          const url = `/public/jobs/removal/${slug}/files`;
          return client.get(url);
        },
      },
      cleaning: {
        getJobs: (params) => {
          const url = "/public/jobs/cleaning";
          return client.get(url, { params });
        },
        getJob: (slug) => {
          const url = `/public/jobs/cleaning/${slug}`;
          return client.get(url);
        },
        getFiles: (slug) => {
          const url = `/public/jobs/cleaning/${slug}/files`;
          return client.get(url);
        },
      },
    },

    blog: {
      getPosts: (params) => {
        const url = "blog/posts/";  // Fixed URL path (only one api/v1)
        return client.get(url, { params });
      },
      getPost: (slug) => {
        const url = `blog/posts/${slug}/`;
        return client.get(url);
      },
    },
  },

  me: {
    getMe: () => {
      const url = "/me/profiles/home-page-headers";
      return client.get(url);
    },
    getProfile: () => {
      const url = "/me/profiles/details";
      return client.get(url);
    },
    updateProfile: (payload) => {
      const url = "/me/profiles/details";
      return client.patch(url, payload, defaultFileUploadConfig);
    },
    getQuotation: () => {
      const url = `/me/quotations`;
      return client.get(url);
    },
    getQuotationDetails: (uid) => {
      const url = `/me/quotations/${uid}`;
      return client.get(url);
    },
    getNotfications: () => {
      const url = `/me/notifications`;
      return client.get(url);
    },
    getNotificationDetails: (uid) => {
      const url = `/me/notifications/${uid}`;
      return client.get(url);
    },
    updateStatus: (uid, payload) => {
      const url = `/me/quotations/${uid}/update-status`;
      return client.post(url, payload);
    },
    confirmPayment: (uid, payload) => {
      const url = `/me/quotations/${uid}/confirm-payment`;
      return client.post(url, payload);
    },
    postDispute: (payload) => {
      const url = `/me/quotations/disputs`;
      return client.post(url, payload);
    },
    postReview: (payload) => {
      const url = `/me/jobs/ratings`;
      return client.post(url, payload);
    },
    getRatings: () => {
      const url = `/me/jobs/ratings`;
      return client.get(url);
    },
    getReview: (uid) => {
      const url = `/me/jobs/ratings/${uid}`;
      return client.get(url);
    },
    getMessages: () => {
      const url = `/me/inbox`;
      return client.get(url);
    },
    getMessageDetails: (uid) => {
      const url = `/me/inbox/${uid}`;
      return client.get(url);
    },
    postMessage: (uid, payload) => {
      const url = `/me/inbox/${uid}`;
      return client.post(url, payload);
    },

    // Add earnings API endpoints
    earnings: {
      getEarnings: () => {
        const url = "/me/earnings";
        return client.get(url);
      },
      getWithdrawnList: () => {
        const url = "/me/earnings/withdrawns";
        return client.get(url);
      },
      requestWithdrawal: (payload) => {
        const url = "/me/earnings/withdrawns";
        return client.post(url, payload);
      }
    },

    job: {
      delivery: {
        postJob: (payload) => {
          const url = "/me/jobs/delivery";
          return client.post(url, payload, defaultFileUploadConfig);
        },
        getJobs: (params) => {
          const url = "/me/jobs/delivery";
          return client.get(url, { params });
        },
        getJob: (uid) => {
          const url = `/me/jobs/delivery/${uid}`;
          return client.get(url);
        },
        getFiles: (uid) => {
          const url = `/me/jobs/delivery/${uid}/files`;
          return client.get(url);
        },
        updateJob: (uid, payload) => {
          const url = `/me/jobs/delivery/${uid}`;
          return client.patch(url, payload, defaultFileUploadConfig);
        },
        deleteFile: (job_uid, file_uid) => {
          const url = `/me/jobs/delivery/${job_uid}/files/${file_uid}`;
          return client.delete(url);
        },
      },
      removal: {
        postJob: (payload) => {
          const url = "/me/jobs/removal";
          return client.post(url, payload, defaultFileUploadConfig);
        },
        getJobs: (params) => {
          const url = "/me/jobs/removal";
          return client.get(url, { params });
        },
        getJob: (uid) => {
          const url = `/me/jobs/removal/${uid}`;
          return client.get(url);
        },
        getFiles: (uid) => {
          const url = `/me/jobs/removal/${uid}/files`;
          return client.get(url);
        },
        updateJob: (uid, payload) => {
          const url = `/me/jobs/removal/${uid}`;
          return client.patch(url, payload, defaultFileUploadConfig);
        },
        deleteFile: (job_uid, file_uid) => {
          const url = `/me/jobs/removal/${job_uid}/files/${file_uid}`;
          return client.delete(url);
        },
      },
      cleaning: {
        postJob: (payload) => {
          const url = "/me/jobs/cleaning";
          return client.post(url, payload, defaultFileUploadConfig);
        },
        getJobs: (params) => {
          const url = "/me/jobs/cleaning";
          return client.get(url, { params });
        },
        getJob: (uid) => {
          const url = `/me/jobs/cleaning/${uid}`;
          return client.get(url);
        },
        getFiles: (uid) => {
          const url = `/me/jobs/cleaning/${uid}/files`;
          return client.get(url);
        },
        updateJob: (uid, payload) => {
          const url = `/me/jobs/cleaning/${uid}`;
          return client.patch(url, payload, defaultFileUploadConfig);
        },
        deleteFile: (job_uid, file_uid) => {
          const url = `/me/jobs/cleaning/${job_uid}/files/${file_uid}`;
          return client.delete(url);
        },
      },
      distance: {
        patchDistance: (uid, payload, category) => {
          const url = `/me/jobs/${category}/${uid}/distance`;
          return client.patch(url, payload, defaultFileUploadConfig);
        },
        getDistance: (uid, category) => {
          const url = `/me/jobs/${category}/${uid}/distance`;
          return client.get(url);
        },
      },
      active: {
        getJobs: () => {
          const url = "/me/jobs/actives?job_count=10";
          return client.get(url);
        },
      },
      completed: {
        getJobs: () => {
          const url = "/me/jobs/completed";
          return client.get(url);
        },
      },
      draft: {
        getJobs: (type) => {
          const url = `/me/jobs/${type}?status=DRAFT`;
          return client.get(url);
        },
      },
      assigned: {
        getJobs: (params) => {
          const url = "/me/jobs/assigned";
          return client.get(url, { params });
        },
        patchDriverDistance: (uid, kind, payload) => {
          if (!uid || !kind) {
            return Promise.reject(new Error('Missing parameters'));
          }

          const url = `/me/jobs/assigned/${uid}/${kind}/distance`;
          console.log('Patch distance URL:', url, payload);
          
          return client.patch(url, payload)
            .then(response => {
              console.log('Distance update success:', response);
              return response;
            })
            .catch(error => {
              console.error('Distance update error:', error.response?.data || error);
              throw error;
            });
        },
        getJobDeatails: (uid, kind) => {
          const url = `/me/jobs/assigned/${uid}/${kind}`;
          return client.get(url);
        },
        getJobDetails: (uid, kind) => {
          if (!uid || !kind) {
            console.error('Missing parameters:', { uid, kind });
            return Promise.reject(new Error('Missing required parameters'));
          }

          // Normalize job kind: remove _job and convert to lowercase
          const normalizedKind = kind.toLowerCase().replace('_job', '');
          const url = `/me/jobs/assigned/${uid}/${normalizedKind}`;
          
          console.log('Requesting job details:', { url, uid, normalizedKind });
          
          return client.get(url)
            .then(response => {
              console.log('Job details response:', response);
              return response;
            })
            .catch(error => {
              console.error('Job details error:', error.response?.data || error);
              throw error;
            });
        },
        getFiles: (uid, kind) => {
          if (!uid || !kind) {
            console.error('Missing parameters:', { uid, kind });
            return Promise.reject(new Error('Missing required parameters'));
          }

          // Normalize job kind: remove _job and convert to lowercase
          const normalizedKind = kind.toLowerCase().replace('_job', '');
          const url = `/me/jobs/assigned/${uid}/${normalizedKind}/files`;
          
          console.log('Requesting files:', { url, uid, normalizedKind });
          
          return client.get(url)
            .then(response => {
              console.log('Files response:', response);
              return response;
            })
            .catch(error => {
              console.error('Files error:', error.response?.data || error);
              throw error;
            });
        },
      },
      jobList: {
        getJobList: (params) => {
          const url = "/me/jobs/";
          return client.get(url, { params });
        },
      },
    },
    quotations: {
      cleaning: {
        postQuotation: (payload) => {
          const url = "/me/quotations/cleaning";
          return client.post(url, payload);
        },
      },
      removal: {
        postQuotation: (payload) => {
          const url = "/me/quotations/removal";
          return client.post(url, payload);
        },
      },
      delivery: {
        postQuotation: (payload) => {
          const url = "/me/quotations/delivery";
          return client.post(url, payload);
        },
      },
      user: {
        getUserDetails: (uid) => {
          const url = `/me/quotations/${uid}/user-details`;
          return client.get(url);
        },
      },
    },
  },
};

export default ApiKit;
