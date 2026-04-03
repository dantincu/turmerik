using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using Turmerik.AspNetCore.Services;
using Turmerik.Core.Utility;
using TrmrkActions = Turmerik.Core.Actions;

namespace Turmerik.AspNetCore.Controllers
{
    public abstract class ApiControllerCoreBase : ControllerBase
    {
        protected abstract WebAppConfigCoreImmtbl AppConfig { get; }

        protected virtual void OnBeforeExecuteAction<TReqData>(TReqData reqData)
            where TReqData : ApiRequestDataCoreBase
        {
            ThrowIfInvalidClientVersion(reqData);
        }

        protected void ThrowIfInvalidClientVersion<TReqData>(TReqData reqData)
            where TReqData : ApiRequestDataCoreBase
        {
            if (reqData.ClientVersion != AppConfig.RequiredClientVersion)
            {
                throw new TrmrkException<TrmrkActions.TrmrkError>(
                    new TrmrkActions.TrmrkError
                    {
                        HttpStatusCode = System.Net.HttpStatusCode.BadRequest,
                        Code = ApiErrorCodesC.INVALID_CLIENT_VERSION,
                        Message = $"Your client app is out of date. Refresh your browser to update it"
                    });
            }
        }

        protected async Task<IActionResult> ExecuteAsync<TReqData>(
            TReqData reqData,
            Func<TReqData, Task<IActionResult>> func,
            Func<TReqData, Exception, IActionResult>? errorHandler)
            where TReqData : ApiRequestDataCoreBase
        {
            IActionResult response;

            try
            {
                OnBeforeExecuteAction(reqData);
                response = await func(reqData);
            }
            catch (Exception ex)
            {
                if (errorHandler != null)
                {
                    response = errorHandler(reqData, ex);
                }
                else
                {
                    response = HandleException(reqData, ex);
                }
            }

            return response;
        }

        protected IActionResult HandleException<TReqData>(
            TReqData reqData,
            Exception ex)
            where TReqData : ApiRequestDataCoreBase
        {
            IActionResult? result = null;

            if (ex is TrmrkException<TrmrkActions.TrmrkError> trmrkExc)
            {
                if (trmrkExc.AdditionalData.HttpStatusCode.HasValue)
                {
                    result = StatusCode((int)trmrkExc.AdditionalData.HttpStatusCode.Value, trmrkExc.AdditionalData);
                }
            }

            result ??= StatusCode(500);
            return result;
        }
    }
}
