// Simple job queue system
class JobQueue {
  constructor() {
    this.jobs = [];
    this.processing = false;
    this.workers = new Map();
    this.stats = {
      processed: 0,
      failed: 0,
      pending: 0
    };
  }

  // Add job to queue
  add(type, data, options = {}) {
    const job = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      delay: options.delay || 0,
      createdAt: new Date(),
      scheduledFor: new Date(Date.now() + (options.delay || 0))
    };

    this.jobs.push(job);
    this.stats.pending++;
    
    if (!this.processing) {
      this.process();
    }

    return job.id;
  }

  // Register job worker
  registerWorker(type, handler) {
    this.workers.set(type, handler);
  }

  // Process jobs
  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.jobs.length > 0) {
      const now = new Date();
      const jobIndex = this.jobs.findIndex(job => job.scheduledFor <= now);
      
      if (jobIndex === -1) {
        // No jobs ready, wait a bit
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      const job = this.jobs.splice(jobIndex, 1)[0];
      this.stats.pending--;

      try {
        const worker = this.workers.get(job.type);
        if (!worker) {
          throw new Error(`No worker registered for job type: ${job.type}`);
        }

        await worker(job.data);
        this.stats.processed++;
        
        console.log(`Job ${job.id} completed successfully`);
      } catch (error) {
        job.attempts++;
        console.error(`Job ${job.id} failed (attempt ${job.attempts}):`, error);

        if (job.attempts < job.maxAttempts) {
          // Retry with exponential backoff
          job.scheduledFor = new Date(Date.now() + (1000 * Math.pow(2, job.attempts)));
          this.jobs.push(job);
          this.stats.pending++;
        } else {
          this.stats.failed++;
          console.error(`Job ${job.id} failed permanently after ${job.attempts} attempts`);
        }
      }
    }

    this.processing = false;
  }

  // Get queue stats
  getStats() {
    return {
      ...this.stats,
      queueSize: this.jobs.length,
      workers: Array.from(this.workers.keys())
    };
  }

  // Clear all jobs
  clear() {
    this.jobs = [];
    this.stats = { processed: 0, failed: 0, pending: 0 };
  }
}

// Global queue instance
export const jobQueue = new JobQueue();

// Job types
export const JobTypes = {
  SEND_EMAIL: 'send_email',
  PROCESS_UPLOAD: 'process_upload',
  GENERATE_REPORT: 'generate_report',
  CLEANUP_FILES: 'cleanup_files',
  SYNC_DATA: 'sync_data'
};

// Register default workers
jobQueue.registerWorker(JobTypes.SEND_EMAIL, async (data) => {
  console.log(`Sending email to ${data.to}: ${data.subject}`);
  // Email sending logic would go here
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
});

jobQueue.registerWorker(JobTypes.PROCESS_UPLOAD, async (data) => {
  console.log(`Processing upload: ${data.filename}`);
  // File processing logic would go here
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
});

jobQueue.registerWorker(JobTypes.CLEANUP_FILES, async (data) => {
  console.log(`Cleaning up files older than ${data.days} days`);
  // Cleanup logic would go here
});

// Helper functions
export function addEmailJob(to, subject, body, options = {}) {
  return jobQueue.add(JobTypes.SEND_EMAIL, { to, subject, body }, options);
}

export function addUploadProcessingJob(filename, path, options = {}) {
  return jobQueue.add(JobTypes.PROCESS_UPLOAD, { filename, path }, options);
}

export function addCleanupJob(days = 30, options = {}) {
  return jobQueue.add(JobTypes.CLEANUP_FILES, { days }, options);
}

// Start processing
jobQueue.process();