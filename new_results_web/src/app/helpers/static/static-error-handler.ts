export class StaticErrorHandler {
  public static instance: StaticErrorHandler;

  private constructor() {}

  public static getInstance(): StaticErrorHandler {
    if (!StaticErrorHandler.instance) {
      StaticErrorHandler.instance = new StaticErrorHandler();
    }

    return StaticErrorHandler.instance;
  }

  /**
   * Retorna a primeira mensagem de error do ambiente ou a mensagem padrão.
   */
  public getErrorMessage(error: [{ message: string; field: string; validation: string }]): string {
    let firstError = `Error: Falha ao consultar serviço.`;

    if (error && Array.isArray(error)) {
      firstError = error[0].message;
    } else if (error && typeof error === 'string') {
      firstError = error;
    }

    return firstError;
  }
}
