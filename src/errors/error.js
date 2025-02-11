/**
 * Creates an instance of ProblemDetails following the RFC 7807 standard.
 * @constructor
 * @param {Object} options
 * @param {string} [options.type='about:blank']
 * @param {string} options.title
 * @param {number} options.status
 * @param {string} options.detail 
 * 
*/
export function ProblemDetails({ type = 'about:blank', title, status, detail }) { 
    if (!new.target) {
        return new ProblemDetails({ type, title, status, detail });
    }

    this.type = type;
    this.title = title;
    this.status = status;
    this.detail = detail;
}
